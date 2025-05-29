import { ErrorPage } from "@/components/pages/ErrorPage";
import { logger } from "@/services/logger.service";
import * as Sentry from "@sentry/bun";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { StatusCode } from "hono/utils/http-status";

async function renderErrorResponse(
	c: Context,
	name: string,
	status: StatusCode,
	message: string,
): Promise<Response> {
	c.status(status);
	return c.render(<ErrorPage name={`${name} ${status}`} message={message} />);
}

export async function renderNotFoundPage(c: Context): Promise<Response> {
	return renderErrorResponse(
		c,
		"Not Found",
		404,
		"The page you are looking for does not exist.",
	);
}

export async function renderErrorPage(
	error: Error | HTTPException,
	c: Context,
): Promise<Response> {
	logger.error(error);
	if (error instanceof HTTPException) {
		// Don't send 403 errors to Sentry, as these are bots sending wrong methods
		if (error.status !== 403) {
			Sentry.captureException(error);
		}
		return renderErrorResponse(c, error.name, error.status, error.message);
	}
	Sentry.captureException(error);
	return renderErrorResponse(c, error.name, 500, error.message);
}
