import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { docsOptions } from "../layout.config";
import ArticleLayout from "@/components/side-bar";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<DocsLayout
			githubUrl="https://github.com/better-auth/better-auth"
			{...docsOptions}
			sidebar={{
				component: (
					<div
						className={cn(
							"[--fd-tocnav-height:36px] overflow-clip md:mr-[268px] lg:mr-[286px] xl:[--fd-toc-width:286px] xl:[--fd-tocnav-height:0px] ",
						)}
					>
						<ArticleLayout />
					</div>
				),
			}}
		>
			{children}
		</DocsLayout>
	);
}
