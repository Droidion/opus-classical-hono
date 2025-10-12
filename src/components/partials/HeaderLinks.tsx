import type { FC } from "hono/jsx";

export const HeaderLinks: FC = () => {
	return (
		<>
			<link
				rel="apple-touch-icon"
				type="image/png"
				sizes="180x180"
				href="/public/apple-touch-icon.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="32x32"
				href="/public/favicon-32x32.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="16x16"
				href="/public/favicon-16x16.png"
			/>
			<link rel="mask-icon" href="/public/safari-pinned-tab.svg" color="#fff" />
			<link
				rel="apple-touch-icon-precomposed"
				type="image/png"
				sizes="180x180"
				href="/public/apple-touch-icon.png"
			/>
			<link rel="icon" type="image/x-icon" href="/public/favicon.ico" />
			<link rel="stylesheet" href="/public/styles.css" />
			<script type="module" src="/public/js/theme-switcher.js" defer />
			<script
				src="https://unpkg.com/htmx.org@2.0.7"
				integrity="sha384-ZBXiYtYQ6hJ2Y0ZNoYuI+Nq5MqWBr+chMrS/RkXpNzQCApHEhOt2aY8EJgqwHLkJ"
				crossorigin="anonymous"
			/>
			<script
				src="https://unpkg.com/hyperscript.org@0.9.14"
				integrity="sha384-NzchC8z9HmP/Ed8cheGl9XuSrFSkDNHPiDl+ujbHE0F0I7tWC4rUnwPXP+7IvVZv"
				crossorigin="anonymous"
			/>
		</>
	);
};
