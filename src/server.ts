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

app.use(
	secureHeaders({
		contentSecurityPolicy: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'"],
			styleSrc: ["'self'", "https:", "'unsafe-inline'"],
			imgSrc: ["'self'", "PUBLIC_IMAGES_URL"],
			fontSrc: ["'self'"],
			connectSrc: ["'self'", "PUBLIC_IMAGES_URL"],
			frameAncestors: ["'none'"],
			formAction: ["'self'"],
			baseUri: ["'self'"],
			upgradeInsecureRequests: [],
		},
		permissionsPolicy: {
			fullscreen: ["self"],
			bluetooth: ["none"],
			syncXhr: [],
			camera: false,
			microphone: [],
			geolocation: [],
			usb: ["self"],
			accelerometer: [],
		},
	}),
);

app.use(csrf());

app.use("/public/*", serveStatic({ root: "./" }));

app.route("/", routes);

app.onError(renderErrorPage);
app.notFound(renderNotFoundPage);

export default {
	port: env.PORT,
	fetch: app.fetch,
};
