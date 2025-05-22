import type { FC } from "hono/jsx";
import { Layout } from "../layouts/Layout";

interface ErrorPageProps {
	name: string;
	message: string;
}

export const ErrorPage: FC<ErrorPageProps> = ({ name, message }) => {
	return (
		<Layout title="Error">
			<div class="mt-10 flex flex-col items-center justify-center">
				<img
					width="400"
					height="305"
					src="/public/images/bach.webp"
					alt="Bach"
				/>
				<div class="mt-5 font-medium font-serif text-3xl xl:text-4xl">
					{name}
				</div>
				<div class="mt-4">{message}</div>
			</div>
		</Layout>
	);
};
