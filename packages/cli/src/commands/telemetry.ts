import { Command } from "commander";
import { telemetry } from "@better-auth/telemetry";

export const telemetryCommand = new Command("telemetry")
  .description("Manage telemetry settings")
  .argument("[command]", "status, enable, or disable")
  .action(async (command: string) => {
    switch (command?.toLowerCase()) {
      case "status":
        console.log(
          `Telemetry is currently ${telemetry.isEnabled() ? "enabled" : "disabled"}`
        );
        break;

      case "enable":
        telemetry.enable();
        console.log("Telemetry has been enabled");
        await telemetry.track("cli:telemetry:enabled", {});
        break;

      case "disable":
        telemetry.disable();
        console.log("Telemetry has been disabled");
        break;

      default:
        console.log(`
Better Auth Telemetry

Usage:
  ba telemetry <command>

Commands:
  status    Show current telemetry status
  enable    Enable telemetry
  disable   Disable telemetry

Environment Variables:
  BETTER_AUTH_TELEMETRY_DISABLED=1    Disable telemetry
  DEBUG=better-auth:telemetry         Show debug information

Note: Better Auth collects anonymous usage data to help improve the project.
      No sensitive information is ever collected.
      You can opt-out at any time by running 'ba telemetry disable'
      or setting BETTER_AUTH_TELEMETRY_DISABLED=1
`);
    }
  }); 