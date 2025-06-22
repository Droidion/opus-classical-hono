import type { FC } from "hono/jsx";

export const SearchTrigger: FC = () => {
	return (
		<>
			<div
				class="search-button label cursor-pointer duration-150 hover:scale-125"
				hx-get="/search-form"
				hx-target="#search-overlay"
				hx-swap="innerHTML"
			>
				<svg
					class="icon h-4 w-4 xl:h-5 xl:w-5"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Search Icon</title>
					<path d="m23.809 21.646-6.205-6.205c1.167-1.605 1.857-3.579 1.857-5.711 0-5.365-4.365-9.73-9.731-9.73-5.365 0-9.73 4.365-9.73 9.73 0 5.366 4.365 9.73 9.73 9.73 2.034 0 3.923-.627 5.487-1.698l6.238 6.238zm-20.955-11.916c0-3.792 3.085-6.877 6.877-6.877s6.877 3.085 6.877 6.877-3.085 6.877-6.877 6.877c-3.793 0-6.877-3.085-6.877-6.877z" />
				</svg>
			</div>
			<div id="search-overlay" />
		</>
	);
};
