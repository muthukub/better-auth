import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { createHash } from 'crypto';
import type { RuntimeEvent, CliEvent, TelemetryEventType, TelemetryOptions } from './events';

const TELEMETRY_ENDPOINT = process.env.BETTER_AUTH_TELEMETRY_ENDPOINT || 'https://telemetry.better-auth.dev/events';
const CONFIG_FILE = '.better-auth-config.json';
const DEBUG = process.env.DEBUG === 'better-auth:telemetry';

interface TelemetryConfig {
  telemetryDisabled: boolean;
  lastUpdated?: string;
  projectId?: string;
}

class Telemetry {
  private config: TelemetryConfig;
  private startTime: number;
  private requestCount: number = 0;

  constructor(options: TelemetryOptions = {}) {
    this.startTime = Date.now();
    this.config = this.loadConfig();
    
    if (options.disabled) {
      this.config.telemetryDisabled = true;
    }
    if (options.projectId) {
      this.config.projectId = options.projectId;
    }
  }

  private loadConfig(): TelemetryConfig {
    const configPath = path.join(os.homedir(), CONFIG_FILE);
    try {
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }
    } catch (error) {
      if (DEBUG) {
        console.debug('Failed to read telemetry config:', error);
      }
    }
    return { telemetryDisabled: false };
  }

  private saveConfig(): void {
    const configPath = path.join(os.homedir(), CONFIG_FILE);
    try {
      this.config.lastUpdated = new Date().toISOString();
      fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      if (DEBUG) {
        console.debug('Failed to save telemetry config:', error);
      }
    }
  }

  private getProjectId(): string {
    if (!this.config.projectId) {
      this.config.projectId = createHash('sha256')
        .update(process.cwd())
        .digest('hex')
        .slice(0, 8);
      this.saveConfig();
    }
    return this.config.projectId;
  }

  private isCI(): boolean {
    return Boolean(
      process.env.CI ||
      process.env.CONTINUOUS_INTEGRATION ||
      process.env.BUILD_NUMBER ||
      process.env.GITHUB_ACTIONS
    );
  }

  private getEnvironment(): string {
    if (this.isCI()) return 'ci';
    return process.env.NODE_ENV || 'development';
  }

  public isEnabled(): boolean {
    return !process.env.BETTER_AUTH_TELEMETRY_DISABLED && !this.config.telemetryDisabled;
  }

  public enable(): void {
    this.config.telemetryDisabled = false;
    this.saveConfig();
  }

  public disable(): void {
    this.config.telemetryDisabled = true;
    this.saveConfig();
  }

  public async trackRuntime(event: TelemetryEventType, data: Partial<RuntimeEvent> = {}): Promise<void> {
    if (!this.isEnabled()) {
      if (DEBUG) {
        console.log('Telemetry disabled, would have sent runtime event:', { event, data });
      }
      return;
    }

    const payload = {
      type: 'runtime',
      event,
      timestamp: new Date().toISOString(),
      projectId: this.getProjectId(),
      data: {
        ...data,
        environment: this.getEnvironment(),
        nodeVersion: process.version,
        platform: os.platform(),
        cpuCount: os.cpus().length,
        uptime: process.uptime(),
        startupTime: Date.now() - this.startTime,
      },
    };

    await this.send(payload);
  }

  public async trackCli(event: string, data: Partial<CliEvent> = {}): Promise<void> {
    if (!this.isEnabled()) {
      if (DEBUG) {
        console.log('Telemetry disabled, would have sent CLI event:', { event, data });
      }
      return;
    }

    const payload = {
      type: 'cli',
      event,
      timestamp: new Date().toISOString(),
      projectId: this.getProjectId(),
      data: {
        ...data,
        nodeVersion: process.version,
        platform: os.platform(),
        ci: this.isCI(),
      },
    };

    await this.send(payload);
  }

  private async send(payload: any): Promise<void> {
    try {
      if (DEBUG) {
        console.log('Sending telemetry:', payload);
      }

      const response = await fetch(TELEMETRY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok && DEBUG) {
        console.error('Failed to send telemetry:', await response.text());
      }
    } catch (error) {
      if (DEBUG) {
        console.error('Error sending telemetry:', error);
      }
    }
  }

  // Utility method to track request counts
  public incrementRequestCount(): void {
    this.requestCount++;
  }

  // Get current metrics
  public getMetrics(): Partial<RuntimeEvent> {
    return {
      startupTime: Date.now() - this.startTime,
      requestCount: this.requestCount,
    };
  }
}

// Export singleton instance
export const telemetry = new Telemetry(); 