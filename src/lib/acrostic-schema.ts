import { z } from "zod";

export const lineSchema = z
  .string()
  .min(1, "내용을 입력해 주세요")
  .max(200, "200자 이내로 입력해 주세요");

export const acrosticLinesSchema = z
  .array(lineSchema)
  .min(1)
  .max(10);

export const createAcrosticSchema = z.object({
  stationId: z.string().min(1),
  lines: acrosticLinesSchema,
});

export const updateAcrosticSchema = z.object({
  id: z.string().min(1),
  lines: acrosticLinesSchema,
});
