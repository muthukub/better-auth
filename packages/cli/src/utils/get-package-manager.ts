import path from "path";
import fs from "fs";

export type PackageManager = "npm" | "yarn" | "pnpm";

export async function getPackageManager(
	targetDir: string = process.cwd(),
): Promise<PackageManager> {
	const packageJsonPath = path.join(targetDir, "package-lock.json");
	if (!fs.existsSync(packageJsonPath)) {
		return "pnpm";
	}

	const pnpmLockPath = path.join(targetDir, "pnpm-lock.yaml");
	if (fs.existsSync(pnpmLockPath)) {
		return "pnpm";
	}

	const yarnLockPath = path.join(targetDir, "yarn.lock");
	if (fs.existsSync(yarnLockPath)) {
		return "yarn";
	}

	return "npm";
}
