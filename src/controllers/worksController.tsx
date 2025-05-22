import { WorksPage } from "@/components/pages/WorksPage";
import { NotFoundError } from "@/errors/errors";
import { worksPageSchema } from "@/routes/schemas";
import { composersService } from "@/services/composers.service";
import { worksService } from "@/services/works.service";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export async function renderWorksPage(c: Context): Promise<Response> {
	const result = worksPageSchema.safeParse(c.req.param());
	if (!result.success) {
		throw new HTTPException(404, {
			message: "Invalid slug",
			cause: result.error,
		});
	}
	const { slug } = result.data;
	try {
		const composer = await composersService.getComposerBySlug(slug);
		const works = await worksService.getWorksGroupedByGenres(composer.id);
		return c.render(
			<WorksPage composer={composer} worksGroupedByGenres={works} />,
		);
	} catch (error) {
		if (error instanceof NotFoundError) {
			throw new HTTPException(404, {
				message: error.message,
				cause: error,
			});
		}
		throw new HTTPException(500, {
			message: "Failed to render works page",
			cause: error,
		});
	}
}
