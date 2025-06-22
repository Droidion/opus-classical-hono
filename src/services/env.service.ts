import { z } from "zod/v4";
import { logger } from "@/services/logger.service";

const envSchema = z.object({
	DATABASE_URL: z.url(),
	PUBLIC_IMAGES_URL: z.url(),
	PORT: z.string().transform(Number).default(3000),
	SENTRY_DSN: z.url(),
});

type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
	try {
		const result = envSchema.safeParse(process.env);
		if (!result.success) {
			logger.error("Invalid environment variables:");
			logger.error(result.error);
			throw new Error("Invalid environment configuration");
		}
		return result.data;
	} catch (error) {
		logger.error("Failed to load environment variables:", error);
		process.exit(1);
	}
}

export const env = loadEnv();
