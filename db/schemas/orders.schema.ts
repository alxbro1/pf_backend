import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  varchar,
  boolean,
  text
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { products } from './products.schema';
import { createInsertSchema } from 'drizzle-zod';

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid',
  'cancelled',
  'refound',
]);


export const shippingStatusEnum = pgEnum("shipping_status", ["pending", "delivered"])


export const orders = pgTable('orders', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  mpOrderId: varchar('mp_order_id', { length: 256 }).unique(),
  userId: text().references(() => users.id),
  orderEstatus: orderStatusEnum('order_status').default('pending'),
  isPaid: boolean('is_paid').default(false),
  amount: integer('amount').notNull(),
  createdAt: varchar('created_at', { length: 256 }).default(
    new Date().toISOString(),
  ),
  discountPercentage: integer("discount_percentage").default(0),
  shippingStatus: shippingStatusEnum("shipping_status").default("pending")
});

export type insertOrders = typeof orders.$inferInsert;
export type selectOrders = typeof orders.$inferSelect;
export const InsertOrderSchema = createInsertSchema(orders);

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  ordersDetails: one(ordersDetails, {
    fields: [orders.id],
    references: [ordersDetails.orderId],
  }),
}));

export const ordersDetails = pgTable('orders_details', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer('order_id').references(() => orders.id),
  productId: varchar('product_id').references(() => products.id),
  quantity: integer('quantity'),
  price: integer('price'),
});

export const ordersDetailsRelations = relations(ordersDetails,({one}) => ({
  order: one(orders, {fields:[ordersDetails.orderId], references:[orders.id]}),
  product: one(products, {fields:[ordersDetails.productId], references:[products.id]}),
}))

export type insertOrdersDetails = typeof ordersDetails.$inferInsert;
export type selectOrdersDetails = typeof ordersDetails.$inferSelect;
export const InsertOrderDetailsSchema = createInsertSchema(ordersDetails);
