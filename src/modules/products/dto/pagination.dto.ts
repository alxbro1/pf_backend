import z from 'zod';

export const paginationDto = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(5).max(20),
});

export type PaginationDto = z.infer<typeof paginationDto>;
