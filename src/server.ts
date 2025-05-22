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
				"'sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+'",
				"'sha384-NzchC8z9HmP/Ed8cheGl9XuSrFSkDNHPiDl+ujbHE0F0I7tWC4rUnwPXP+7IvVZv'",
				"'sha256-+oo7jjbAO+Tr8PDe/GEu0E6XloRL/L3Z99OlkkDaR/g='",
				"'sha256-IAtnNNAx7da4mm6HkJYJl2ZFVK69KgFdHXrV1wPK98c='",
			],
			styleSrc: ["'self'", "https:", "'unsafe-inline'"],
			imgSrc: ["'self'", "https://s3.opusclassical.net"],
			fontSrc: ["'self'"],
			connectSrc: ["'self'", "https://s3.opusclassical.net"],
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

app.use(
	csrf({
		origin: (origin) => {
			const url = new URL(origin);
			return (
				url.hostname === "localhost" || url.hostname === "opusclassical.net"
			);
		},
	}),
);

app.use("/public/*", serveStatic({ root: "./" }));

app.route("/", routes);

app.onError(renderErrorPage);
app.notFound(renderNotFoundPage);

export default {
	port: env.PORT,
	fetch: app.fetch,
};
