import { z } from "zod/v4";

const slugSchema = z.string().min(1);
const queryShema = slugSchema;
const workIdSchema = z
	.string()
	.transform(Number)
	.pipe(z.number().int().positive());

export const composerSearchSchema = z.object({
	query: queryShema,
});

export const worksPageSchema = z.object({
	slug: slugSchema,
});

export const recordingsPageSchema = z.object({
	slug: slugSchema,
	workId: workIdSchema,
});
