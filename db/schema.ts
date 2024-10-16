import { isNotNull, relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// export const roleEnum = pgEnum('role_enum', [
//   'CUSTOMER',
//   'ADMIN',
//   'PROVIDER',
//   'OWNER',
// ]);

export const productTypeEnum = pgEnum('type_product_enum', [
  'DIGITAL',
  'PHISICAL',
]);

export const users = pgTable('user', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: timestamp('email_verified', {
    mode: 'date',
    withTimezone: true,
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  image: varchar('image', { length: 255 }).notNull(),
});

// export const usersRelations = relations(users, ({ many }) => ({
//   orders: many(orders),
// }));

// export const orders = pgTable('orders', {
//   id,
//   created_at: timestamp('created_at').notNull().defaultNow(),
//   userId: uuid('user_id'),
//   ordersDetailsId: uuid('orders_detail_id'),
// });

// export const ordersRelations = relations(orders, ({ one, many }) => ({
//   user: one(users, { fields: [orders.userId], references: [users.id] }),
//   ordersDetails: many(ordersDetails),
// }));

// export const ordersDetails = pgTable('orders_details', {
//   id,
//   productId: uuid('product_id'),
//   quantity: integer().notNull(),
//   price: integer().notNull(),
//   orderId: uuid('orders_id'),
// });

// export const ordersDetailsRelations = relations(ordersDetails, ({ one }) => ({
//   orders: one(orders, {
//     fields: [ordersDetails.orderId],
//     references: [orders.id],
//   }),
//   products: one(products, {
//     fields: [ordersDetails.productId],
//     references: [products.id],
//   }),
// }));

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
  categoryId: (schema) => schema.categoryId,
});
export type InsertProduct = typeof products.$inferInsert;

// export const productsRelations = relations(products, ({ many, one }) => ({
//   ordersDetails: many(orders),
//   phisicalProduct: one(phisicalProduct),
//   digitalProduct: one(digitalProduct),
//   images: many(images)
// }));

// export const phisicalProduct = pgTable('phisical_product', {
//   id,
//   weight: integer().notNull(),
//   categoryId: uuid('category_id'),
//   productId: uuid('product_id'),
// });

// export const phisicalProductRelations = relations(
//   phisicalProduct,
//   ({ one }) => ({
//     product: one(products, {
//       fields: [phisicalProduct.productId],
//       references: [products.id],
//     }),
//     category: one(categories, {
//       fields: [phisicalProduct.productId],
//       references: [categories.id],
//     }),
//   }),
// );

export const categories = pgTable('categories', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar({ length: 50 }).notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const insertCategorySchema = createInsertSchema(categories, {
  name: (schema) => schema.name.min(3).max(50),
});

export type InsertCategory = typeof categories.$inferInsert;

// export const categoriesRelations = relations(categories, ({ one, many }) => ({
//   father: one(categories, {
//     fields: [categories.fatherId],
//     references: [categories.id],
//   }),
//   child: many(categories),
//   product: many(products),
// }));

// export const digitalProduct = pgTable('digital_product', {
//   id,
//   cdKey: varchar({ length: 20 }).notNull(),
//   genreId: uuid('genre_id'),
//   productId: uuid('product_id'),
// });

// export const digitalProductRelations = relations(digitalProduct, ({ one }) => ({
//   product: one(products, {
//     fields: [digitalProduct.productId],
//     references: [products.id],
//   }),
//   genre: one(genres, {
//     fields: [digitalProduct.genreId],
//     references: [genres.id],
//   }),
// }));

// export const genres = pgTable('genres', {
//   id,
//   name: varchar({ length: 15 }).notNull(),
// });

// export const genresRelations = relations(genres, ({ many }) => ({
//   products: many(phisicalProduct),
// }));

// export const images = pgTable('images', {
//   assetId:varchar().primaryKey(),
//   url: varchar().notNull(),
//   productId:uuid('product_id').notNull()
// })

// export const imagesRelations = relations(images, ({one}) => ({
//   product: one(products,{fields:[images.productId], references:[products.id]})
// }))
