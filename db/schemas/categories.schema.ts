import { relations } from 'drizzle-orm';
import {
  pgTable,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { products } from './products.schema';

export const categories = pgTable('categories', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar({ length: 50 }).notNull().unique(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const insertCategorySchema = createInsertSchema(categories, {
  name: (schema) => schema.name.min(3).max(50),
});
export type InsertCategory = z.infer<typeof insertCategorySchema>;
