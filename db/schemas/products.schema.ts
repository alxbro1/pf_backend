import { relations } from 'drizzle-orm';
import { boolean } from 'drizzle-orm/pg-core';
import { integer, pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { categories } from './categories.schema';

export const productTypeEnum = pgEnum('type_product_enum', [
  'digital',
  'physical',
]);

export const products = pgTable('products', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  price: integer().notNull(),
  description: varchar({ length: 255 }).notNull(),
  type: productTypeEnum().notNull(),
  stock: integer().notNull(),
  name: varchar({ length: 100 }).notNull(),
  categoryId: varchar({ length: 255 })
    .references(() => categories.id)
    .notNull(),
  imageUrl: varchar({ length: 255 }).notNull(),
  active: boolean().default(true).notNull(),
});

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const productInsertSchema = createInsertSchema(products, {
  name: (schema) => schema.name.min(3).max(100),
  price: (schema) => schema.price,
  description: (schema) => schema.description.max(255),
  type: (schema) => schema.type,
  stock: (schema) => schema.stock,
  categoryId: (schema) => schema.categoryId.uuid('ID must be UUID'),
});
export type InsertProduct = typeof products.$inferInsert;
export const insertProductSchema = createInsertSchema(products);
export type ProductEntity = typeof products.$inferSelect;
