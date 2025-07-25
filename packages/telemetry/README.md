# @better-auth/telemetry

Telemetry tracking for Better Auth. This package collects anonymous usage data to help improve the project.

## Usage

The telemetry package is used internally by Better Auth CLI and runtime packages. Users can control telemetry settings using the CLI:

```bash
# Show current status
ba telemetry status

# Enable telemetry
ba telemetry enable

# Disable telemetry
ba telemetry disable
```

Or by setting environment variables:

```bash
# Disable telemetry
BETTER_AUTH_TELEMETRY_DISABLED=1

# Enable debug logging
DEBUG=better-auth:telemetry
```

## What We Track

We collect anonymous usage data to help improve Better Auth:

- CLI command usage (e.g., `ba init`, `ba generate`)
- Runtime features used (e.g., authentication methods, adapters)
- Error types (no error messages or stack traces)
- Environment information (Node.js version, OS platform)
- Project ID (anonymized hash of project path)

We **never** collect:

- Personal information
- Project names or paths
- Environment variables
- Secrets or credentials
- IP addresses
- Error messages or stack traces

## How It Works

The telemetry package uses a simple HTTP client to send events to our telemetry endpoint. Events are sent asynchronously and failures are silently ignored to avoid impacting the user experience.

Events are stored in ClickHouse and used to generate aggregate statistics about Better Auth usage. This helps us:

- Understand which features are most used
- Identify common error patterns
- Guide development priorities
- Improve documentation

## For Developers

If you're developing Better Auth packages, you can use the telemetry package to track events:

```typescript
import { telemetry } from '@better-auth/telemetry';

// Track a simple event
await telemetry.track('my-event');

// Track an event with data
await telemetry.track('feature-used', {
  feature: 'passkeys',
  adapter: 'prisma'
});

// Track an error
try {
  // ...
} catch (error) {
  await telemetry.track('error', { type: error.name });
}
```

## License

MIT 