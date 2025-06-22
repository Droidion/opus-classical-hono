import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { renderComposersPage } from "@/controllers/composersController";
import { renderRecordingsPage } from "@/controllers/recordingsController";
import {
	renderSearchForm,
	renderSearchResults,
} from "@/controllers/searchController";
import { renderWorksPage } from "@/controllers/worksController";

const routes = new Hono();

routes.use("/", jsxRenderer());
routes.use("/composer/*", jsxRenderer());

routes.get("/", renderComposersPage);
routes.get("/composer/:slug", renderWorksPage);
routes.get("/composer/:slug/work/:workId", renderRecordingsPage);
routes.get("/search-form", renderSearchForm);
routes.post("/search-results", renderSearchResults);
export { routes };
