"use client";
import { Copy, Pencil } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import React from "react";
interface DocsHeaderProps {
	title: string;
	description?: string;
	githubPath?: string;
}

export function DocsHeader({
	title,
	description,
	githubPath,
}: DocsHeaderProps) {
	const handleCopyMarkdown = () => {
		const markdown = `# ${title}\n\n${description || ""}`;
		navigator.clipboard.writeText(markdown);
		toast.success("Copied to clipboard");
	};
	const grid = genRandomPattern();

	return (
		<div className="relative pt-10 mb-6 -mt-18 -mx-[max(0px,calc((100%-90rem)/2+26.5rem))] border-t-0 border-y overflow-hidden px-2 pl-5">
			<div className="max-w-full mx-auto py-8 relative">
				<div className="h-[calc(100%+4rem)] w-px bg-input absolute -top-4 -left-1" />
				<div>
					<div className="h-[calc(100%+4rem)] w-[17.5px] absolute -top-4 -left-5 bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)] opacity-80"></div>
				</div>

				<div className="grid gap-1 pl-2">
					<h1 className="scroll-m-20 text-4xl font-semibold tracking-tight">
						{title}
					</h1>
					{description && (
						<p className="text-muted-foreground font-normal font-mono uppercase tracking-tight text-[13px]">
							{description}
						</p>
					)}
				</div>
			</div>
			<div className="from-foreground/5 to-foreground/1 absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-100">
				<GridPattern
					width={20}
					height={20}
					x="-12"
					y="4"
					squares={grid}
					className="fill-foreground/5 stroke-foreground/[6%] absolute top-0 left-0 h-full w-full mix-blend-overlay"
				/>
			</div>
			<div className="absolute bottom-3 right-6 flex">
				<Button
					variant="outline"
					size="sm"
					className="gap-1.5 font-thin tracking-tight uppercase font-mono text-[10px] border-r-0"
					onClick={handleCopyMarkdown}
				>
					<Copy className="h-2 w-2 stroke-1" />
					Copy
				</Button>
				{githubPath && (
					<Button
						variant="outline"
						size="sm"
						className="gap-1.5 font-thin tracking-tight uppercase font-mono text-[10px]"
						asChild
					>
						<a
							href={`https://github.com/better-auth/better-auth/edit/main/docs/content/docs/${githubPath}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Pencil className="h-2 w-2 stroke-1" />
							Edit
						</a>
					</Button>
				)}
			</div>
		</div>
	);
}
function GridPattern({
	width,
	height,
	x,
	y,
	squares,
	...props
}: React.ComponentProps<"svg"> & {
	width: number;
	height: number;
	x: string;
	y: string;
	squares?: number[][];
}) {
	const patternId = React.useId();

	return (
		<svg aria-hidden="true" {...props}>
			<defs>
				<pattern
					id={patternId}
					width={width}
					height={height}
					patternUnits="userSpaceOnUse"
					x={x}
					y={y}
				>
					<path d={`M.5 ${height}V.5H${width}`} fill="none" />
				</pattern>
			</defs>
			<rect
				width="100%"
				height="100%"
				strokeWidth={0}
				fill={`url(#${patternId})`}
			/>
			{squares && (
				<svg x={x} y={y} className="overflow-visible">
					{squares.map(([x, y], index) => (
						<rect
							strokeWidth="0"
							key={index}
							width={width + 1}
							height={height + 1}
							x={(x ?? 1) * width}
							y={(y ?? 1) * height}
						/>
					))}
					{squares.map(([x, y], index) => (
						<rect
							strokeWidth="0"
							key={index}
							width={width + 1}
							height={height + 1}
							x={x * 1.25 * width}
							y={y * 1.25 * height}
						/>
					))}
					{squares.map(([x, y], index) => (
						<rect
							strokeWidth="0"
							key={index}
							width={width + 1}
							height={height + 1}
							x={x * 4.25 * width}
							y={y * 4.25 * height}
						/>
					))}
				</svg>
			)}
		</svg>
	);
}
function genRandomPattern(length?: number): number[][] {
	length = length ?? 5;
	return Array.from({ length }, () => [
		Math.floor(Math.random() * 4) + 7, // random x between 7 and 10
		Math.floor(Math.random() * 6) + 1, // random y between 1 and 6
	]);
}
