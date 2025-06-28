import chalk from "chalk";

const br = () => console.log("");

export const renderIntro = () => {
	console.clear();
	br();
	console.log(
		`  ${chalk.bold.green("◆")}  ${chalk.bold("Welcome to Better Auth")}`,
	);
	console.log(
		`     ${chalk.dim("The official CLI to supercharge your project.")}`,
	);
	br();
};

export const renderStep = (step: string, message: string) => {
	console.log(`  ${chalk.bold.gray(step)}  ${chalk.bold(message)}`);
};

export const renderOutro = (message: string) => {
	br();
	console.log(`  ${chalk.bold.green("✔")}  ${chalk.bold(message)}`);
	br();
};
