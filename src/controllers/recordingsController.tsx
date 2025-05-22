import { RecordingsPage } from "@/components/pages/RecordingsPage";
import { NotFoundError } from "@/errors/errors";
import { recordingsPageSchema } from "@/routes/schemas";
import { composersService } from "@/services/composers.service";
import { recordingsService } from "@/services/recordings.service";
import { worksService } from "@/services/works.service";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export async function renderRecordingsPage(c: Context): Promise<Response> {
	const result = recordingsPageSchema.safeParse(c.req.param());
	if (!result.success) {
		throw new HTTPException(404, {
			message: "Invalid work ID",
			cause: result.error,
		});
	}
	const { slug, workId } = result.data;
	try {
		const work = await worksService.getWorkById(workId);
		const composer = await composersService.getComposerBySlug(slug);
		const recordingsWithPerformersAndLinks =
			await recordingsService.recordingsWithPerformersAndLinks(work.id);
		return c.render(
			<RecordingsPage
				work={work}
				composer={composer}
				recordingsWithPerformersAndLinks={recordingsWithPerformersAndLinks}
			/>,
		);
	} catch (error) {
		if (error instanceof NotFoundError) {
			throw new HTTPException(404, {
				message: error.message,
				cause: error,
			});
		}
		throw new HTTPException(500, {
			message: "Failed to render recordings page",
			cause: error,
		});
	}
}
