import { ComposerSearchForm } from "@/components/partials/ComposerSearchForm";
import { ComposerSearchResults } from "@/components/partials/ComposerSearchResults";
import { composerSearchSchema } from "@/routes/schemas";
import { searchService } from "@/services/search.service";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export async function renderSearchForm(c: Context): Promise<Response> {
	await searchService.cacheComposers();
	return c.render(<ComposerSearchForm />);
}

export async function renderSearchResults(c: Context): Promise<Response> {
	const body = await c.req.parseBody();
	const result = composerSearchSchema.safeParse(body);
	if (!result.success) {
		return c.render(<ComposerSearchResults composers={[]} />);
	}
	const { query } = result.data;
	try {
		const composers = await searchService.searchComposers(query);
		return c.render(<ComposerSearchResults composers={composers} />);
	} catch (error) {
		throw new HTTPException(500, {
			message: "Failed to render search results",
			cause: error,
		});
	}
}
