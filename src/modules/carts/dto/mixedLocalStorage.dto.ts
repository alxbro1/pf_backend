import { userInfo } from 'os';
import { z } from 'zod';

export const mixedLocalStorageDto = z.object({
  products: z.array(
    z.object({
      productId: z.string().uuid(),
      qty: z.number().min(1),
    }),
  ),
  userId: z.string().uuid(),
});

export type MixedLocalStorageDto = z.infer<typeof mixedLocalStorageDto>;
