import { Command } from "commander";
import execa from "execa";
import path from "path";
import fs from "fs/promises";
import {
	intro,
	log,
	multiselect,
	outro,
	spinner,
	cancel,
	isCancel,
} from "@clack/prompts";
import chalk from "chalk";
import { getPackageManager } from "../utils/get-package-manager";

const availablePlugins = [
	{ value: "admin", label: "Admin" },
	{ value: "api-key", label: "API Key" },
	{ value: "anonymous", label: "Anonymous" },
	{ value: "bearer", label: "Bearer" },
	{ value: "email-otp", label: "Email OTP" },
	{ value: "generic-oauth", label: "Generic OAuth" },
	{ value: "jwt", label: "JWT" },
	{ value: "magic-link", label: "Magic Link" },
	{ value: "multi-session", label: "Multi-Session" },
	{ value: "next-cookies", label: "Next Cookies" },
	{ value: "oauth-proxy", label: "OAuth Proxy" },
	{ value: "oidc", label: "OIDC" },
	{ value: "one-tap", label: "One-Tap" },
	{ value: "open-api", label: "OpenAPI" },
	{ value: "organization", label: "Organization" },
	{ value: "passkey", label: "Passkey" },
	{ value: "phone-number", label: "Phone Number" },
	{ value: "sso", label: "SSO" },
	{ value: "stripe", label: "Stripe" },
	{ value: "two-factor", label: "Two-Factor" },
	{ value: "username", label: "Username" },
];

export const add = new Command("add")
	.description("Add a @better-auth plugin to your project.")
	.argument("[plugins...]", "The plugin(s) to add.")
	.option("-a, --all", "Install all available plugins", false)
	.action(async (plugins: string[], options: { all: boolean }) => {
		let pluginsToAdd = plugins;

		intro("👋 Adding plugins to your project");

		if (options.all) {
			pluginsToAdd = availablePlugins.map((p) => p.value);
		} else if (plugins.length === 0) {
			const selectedPlugins = await multiselect({
				message: "Which plugins would you like to add?",
				options: availablePlugins,
				required: false,
			});

			if (isCancel(selectedPlugins)) {
				cancel("Aborted. No plugins were added.");
				process.exit(0);
			}

			if (!selectedPlugins || selectedPlugins.length === 0) {
				log.warn("No plugins selected. Exiting.");
				process.exit(0);
			}
			pluginsToAdd = selectedPlugins;
		}

		const s = spinner();
		s.start("Installing dependencies");

		const packageManager = await getPackageManager(process.cwd());

		try {
			const packages = pluginsToAdd.map((plugin) => {
				if (plugin.startsWith("@better-auth/")) {
					return plugin;
				}
				return `@better-auth/${plugin}`;
			});

			s.message(
				`Installing ${chalk.green(
					packages.join(", "),
				)} using ${packageManager}.`,
			);

			const installCommand = packageManager === "npm" ? "install" : "add";

			await execa(packageManager, [installCommand, ...packages]);

			const packageJsonPath = path.join(process.cwd(), "package.json");
			const packageJsonContent = await fs.readFile(packageJsonPath, "utf-8");
			const packageJson = JSON.parse(packageJsonContent);

			const installedPackagesWithVersions = packages.map((pkg) => {
				const version =
					packageJson.dependencies?.[pkg] ||
					packageJson.devDependencies?.[pkg] ||
					"latest";
				return `${pkg}@${version}`;
			});

			s.stop("Plugins installed successfully!");

			outro("🎉 You're all set!");
			log.info("The following packages were added to your project:");
			log.message(
				installedPackagesWithVersions
					.map((p) => `  - ${chalk.cyan(p)}`)
					.join("\n"),
			);
		} catch (error) {
			s.stop("Failed to install plugins.");
			if (error instanceof Error) {
				log.error(error.message);
			} else {
				log.error("An unknown error occurred.");
				console.error(error);
			}
			process.exit(1);
		}
	}); 