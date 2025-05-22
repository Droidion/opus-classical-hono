import "@/services/sentry.service";

import {
	renderErrorPage,
	renderNotFoundPage,
} from "@/controllers/errorController";
import { routes } from "@/routes";
import { env } from "@/services/env.service";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono();

app.use(secureHeaders());
app.use(csrf());

app.use("/public/*", serveStatic({ root: "./" }));

app.route("/", routes);

app.onError(renderErrorPage);
app.notFound(renderNotFoundPage);

export default {
	port: env.PORT,
	fetch: app.fetch,
};
