import "@/services/sentry.service";

import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";
import { csrfConfig, secureHeadersConfig } from "@/config/plugins";
import {
	renderErrorPage,
	renderNotFoundPage,
} from "@/controllers/errorController";
import { routes } from "@/routes";
import { env } from "@/services/env.service";

const app = new Hono();

app.use(secureHeaders(secureHeadersConfig));
app.use(csrf(csrfConfig));

app.use("/public/*", serveStatic({ root: "./" }));

app.route("/", routes);

app.onError(renderErrorPage);
app.notFound(renderNotFoundPage);

export default {
	port: env.PORT,
	fetch: app.fetch,
};
