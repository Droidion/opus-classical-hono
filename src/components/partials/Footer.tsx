import { GithubIcon } from "@/components/icons/GithubIcon";

export const Footer = () => {
	return (
		<footer class="flex h-16 w-full max-w-screen-xl items-center justify-center bg-black/20 px-4 xl:bg-white dark:bg-mineshaft dark:xl:bg-codgray">
			<a
				class="mx-3"
				title="Buy me a coffee"
				href="https://www.buymeacoffee.com/zunh"
				aria-label="Buy me a coffee"
				rel="noopener noreferrer"
			>
				<img
					alt="Buy me a coffee"
					class="h-8"
					width="128"
					height="36"
					src="/public/images/bmc-button.svg"
				/>
			</a>
			<a
				class="mx-3"
				title="Github repository"
				href="https://github.com/Droidion/opus-classical-hono"
				aria-label="Github repository"
				rel="noopener noreferrer"
			>
				<GithubIcon />
			</a>
		</footer>
	);
};
