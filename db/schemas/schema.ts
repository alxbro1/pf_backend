import { relations } from 'drizzle-orm';
import { uniqueIndex } from 'drizzle-orm/pg-core';
import {
  boolean,
  text,
  primaryKey,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// export const roleEnum = pgEnum('role_enum', [
//   'CUSTOMER',
//   'ADMIN',
//   'PROVIDER',
//   'OWNER',
// ]);

export const productTypeEnum = pgEnum('type_product_enum', [
  'digital',
  'physical',
]);

export const users = pgTable(
  'user',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    email: text('email').unique().notNull(),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    password: text('password'),
    username: text('username').unique().notNull(),
    image: text('image').default('default_profile_picture.png').notNull(),
    active: boolean().default(true).notNull(),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex('email_idx').on(table.email),
    };
  },
);

const insertUserSchema = createInsertSchema(users);
export type CreateUserDto = z.infer<typeof insertUserSchema>;

const selectUserSchema = createSelectSchema(users).pick({
  id: true,
  name: true,
  email: true,
  image: true,
});
export type SelectUserDto = z.infer<typeof selectUserSchema>;

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // type: text('type').$type<AdapterAccountType>().notNull(),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);

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
const insertProductSchema = createInsertSchema(products);

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
  name: varchar({ length: 50 }).unique().notNull(),
});

export const selectCategoriesSchema = createSelectSchema(categories).pick({
  name: true,
});
export type Categories = z.infer<typeof selectCategoriesSchema>;

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const insertCategorySchema = createInsertSchema(categories, {
  name: (schema) => schema.name.min(3).max(50),
});
export type InsertCategory = z.infer<typeof insertCategorySchema>;

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

export * from './auth.schema';
export * from './products.schema';
export * from './categories.schema';
export * from './users.schema';
export * from './orders.schema';
