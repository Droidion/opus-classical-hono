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
			scriptSrc: [
				"'self'",
				"'sha384-Y7hw+L/jvKeWIRRkqWYfPcvVxHzVzn5REgzbawhxAuQGwX1XWe70vji+VSeHOThJ'",
				"'sha256-qvfN6NoYkoOeuARSE99bvlVf/W/fb9x0yiH5xYSM6i8='",
				"'sha256-+oo7jjbAO+Tr8PDe/GEu0E6XloRL/L3Z99OlkkDaR/g='",
				"'sha256-IAtnNNAx7da4mm6HkJYJl2ZFVK69KgFdHXrV1wPK98c='",
			],
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
