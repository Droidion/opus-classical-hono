import type { FC } from "hono/jsx";

export const HeaderMeta: FC = () => {
	return (
		<>
			<meta
				name="description"
				content="Catalogue for streaming classical music."
			/>
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta name="msapplication-TileColor" content="#da532c" />
			<meta
				name="theme-color"
				media="(prefers-color-scheme: light)"
				content="#ffffff"
			/>
			<meta
				name="theme-color"
				media="(prefers-color-scheme: dark)"
				content="#1a1a1a"
			/>
			<meta name="color-scheme" content="dark light" />
		</>
	);
};
