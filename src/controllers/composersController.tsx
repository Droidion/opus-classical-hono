import { ComposersPage } from "@/components/pages/ComposersPage";
import { NotFoundError } from "@/errors/errors";
import { composersService } from "@/services/composers.service";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export async function renderComposersPage(c: Context): Promise<Response> {
	try {
		const composersGroupedByPeriods =
			await composersService.getComposersGroupedByPeriods();
		return c.render(
			<ComposersPage composersGroupedByPeriods={composersGroupedByPeriods} />,
		);
	} catch (error) {
		if (error instanceof NotFoundError) {
			throw new HTTPException(404, {
				message: error.message,
				cause: error,
			});
		}
		throw new HTTPException(500, {
			message: "Failed to render composers page",
			cause: error,
		});
	}
}
