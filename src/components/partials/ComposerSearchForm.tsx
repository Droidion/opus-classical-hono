import type { FC } from "hono/jsx";

export const ComposerSearchForm: FC = () => {
	return (
		<div
			class="fixed inset-0 bg-black/35 backdrop-blur-sm"
			_="on click if not event.target.closest('#search-form') remove me end
               on keydown[key=='Escape'] remove me"
		>
			<div
				id="search-form"
				class="absolute top-32 left-[calc(50%-10rem)] w-80 rounded bg-white text-lg shadow-md dark:bg-mineshaft"
			>
				<input
					class="m-1.5 h-8 w-[calc(100%-0.8rem)] appearance-none rounded-sm border-0 bg-black/10 px-1.5 py-4 text-black placeholder:font-light focus:outline-none dark:text-white/80"
					type="search"
					placeholder="Search composers by last name"
					hx-post="/search-results"
					hx-trigger="input throttle:300ms, search"
					hx-target="#search-results"
					name="query"
					_="on load or htmx:afterSwap call me.focus()"
				/>
				<div id="search-results" />
			</div>
		</div>
	);
};
