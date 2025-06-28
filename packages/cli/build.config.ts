import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	outDir: "dist",
	externals: [
		"better-auth",
		"better-call",
		"execa",
		"ora",
		"chalk",
		"prompts",
		"commander",
	],
	entries: ["./src/index.ts"],
	failOnWarn: false
});
