import { Footer } from "@/components/partials/Footer";
import { Header } from "@/components/partials/Header";
import { HeaderLinks } from "@/components/partials/HeaderLinks";
import { HeaderMeta } from "@/components/partials/HeaderMeta";
import type { FC, PropsWithChildren } from "hono/jsx";

interface LayoutProps {
	title: string;
}

export const Layout: FC<PropsWithChildren<LayoutProps>> = ({
	title,
	children,
}) => {
	return (
		<html lang="en">
			<head>
				<title>{title} | Opus Classical</title>
				<HeaderMeta />
				<HeaderLinks />
			</head>
			<body>
				<script src="/public/js/theme-loader.js" />
				<div class="grid min-h-screen w-full grid-rows-[auto_1fr_auto] justify-items-center">
					<Header />
					<main class="main flex w-full max-w-screen-xl flex-col overflow-auto px-4 pb-4">
						{children}
					</main>
					<Footer />
				</div>
			</body>
		</html>
	);
};
