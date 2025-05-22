import { MainLogo } from "@/components/icons/MainLogo";
import { SearchTrigger } from "@/components/partials/SearchTrigger";
import { ThemeSwitcher } from "@/components/partials/ThemeSwitcher";
import type { FC } from "hono/jsx";

export const Header: FC = () => {
	return (
		<header class="top-0 z-10 flex h-16 w-full max-w-screen-xl items-center justify-between bg-black/20 px-4 xl:sticky xl:h-24 xl:bg-white dark:bg-mineshaft dark:xl:bg-codgray">
			<MainLogo />
			<nav class="menu flex items-center">
				<div class="mr-4">
					<ThemeSwitcher />
				</div>
				<SearchTrigger />
			</nav>
		</header>
	);
};
