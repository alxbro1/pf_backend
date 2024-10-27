import { pgTable, text } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { cartAndProducts } from './cart_products.schema';

export const carts = pgTable('carts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull()
    .unique(),
});

export const cartRelations = relations(carts, ({ many, one }) => ({
  user: one(users, { fields: [carts.userId], references: [users.id] }),
  products: many(cartAndProducts),
}));
