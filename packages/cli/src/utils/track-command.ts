import { telemetry } from "@better-auth/telemetry";

export async function trackCommand(
  command: string,
  data: Record<string, any> = {}
): Promise<void> {
  try {
    await telemetry.track(`cli:${command}`, {
      ...data,
      nodeVersion: process.version,
      platform: process.platform,
    });
  } catch (error) {
    // Silently ignore telemetry errors
    if (process.env.DEBUG === "better-auth:telemetry") {
      console.error("Telemetry error:", error);
    }
  }
} 