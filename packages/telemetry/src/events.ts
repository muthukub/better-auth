export interface RuntimeEvent {
  // Core configuration
  adapter?: string;          // 'prisma' | 'drizzle' | 'mongoose' etc.
  features?: string[];       // ['passkeys', 'oauth', 'magic-link', etc.]
  environment?: string;      // 'development' | 'production' | 'test'
  framework?: string;        // 'next' | 'sveltekit' | 'nuxt' etc.
  nodeVersion?: string;
  version?: string;         // Better Auth version

  // Feature-specific data
  authMethods?: string[];   // Active authentication methods
  oauthProviders?: string[]; // Configured OAuth providers
  hasCustomDomain?: boolean;
  hasSAML?: boolean;
  hasWebAuthn?: boolean;
  hasRateLimit?: boolean;
  hasEmailVerification?: boolean;

  // Database info
  databaseType?: string;    // PostgreSQL, MySQL, SQLite, etc.
  migrations?: number;      // Number of migrations applied
  
  // Error tracking
  errorType?: string;
  errorCode?: string;
  
  // Performance metrics
  startupTime?: number;    // Time taken to initialize
  requestCount?: number;   // Number of auth requests
}

export interface CliEvent {
  command: string;
  subCommand?: string;
  version: string;
  flags?: string[];
  duration?: number;
  success: boolean;
  nodeVersion: string;
  ci: boolean;
}

export type TelemetryEventType =
  | 'init'                // When Better Auth is initialized
  | 'auth:success'        // Successful authentication
  | 'auth:error'          // Authentication error
  | 'migration:start'     // Migration started
  | 'migration:complete'  // Migration completed
  | 'migration:error'     // Migration failed
  | 'adapter:connect'     // Database adapter connected
  | 'adapter:error'       // Database adapter error
  | 'oauth:success'       // OAuth authentication success
  | 'oauth:error'         // OAuth authentication error
  | 'email:sent'         // Email verification/magic link sent
  | 'webauthn:register'  // WebAuthn registration
  | 'webauthn:auth'      // WebAuthn authentication
  | 'rate-limit:hit'     // Rate limit reached
  | 'cli:command'        // CLI command executed
  | 'error'             // General error
  | 'warning'           // Warning event
  | string;             // Allow custom events

export interface TelemetryOptions {
  disabled?: boolean;
  debug?: boolean;
  endpoint?: string;
  projectId?: string;
} 