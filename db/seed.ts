import { faker } from '@faker-js/faker';

import { db } from '../src/config/db';
import {
  products,
  categories,
  users,
  type CreateUserDto,
  type Categories,
} from './schemas/schema';

import { IgamesObjects, gamesArray, categoriesArray, IgamesObjectsForDb } from './gamesArray.objects';

const main = async () => {
  const categoriesData: Set<string> = new Set();

  const productsData: (typeof products.$inferInsert)[] = [];

  const usersData: CreateUserDto[] = [];

  for (let i = 0; i < 10; i++) {
    categoriesData.add(faker.commerce.department().toLowerCase());
  }

  const categoriesArray: Categories[] = Array.from(categoriesData).map(
    (categoryName) => ({
      name: categoryName,
    }),
  );

  const resultCategories = await db
    .insert(categories)
    .values(categoriesArray)
    .returning({ id: categories.id });

  for (let i = 0; i < 50; i++) {
    productsData.push({
      name: `${faker.word.adjective().toLowerCase()} ${faker.word.noun().toLowerCase()}`,
      price: faker.number.int({ min: 10, max: 1000 }),
      description: faker.lorem.sentence(),
      type: faker.helpers.arrayElement(['digital', 'physical']),
      stock: faker.number.int({ min: 1, max: 100 }),
      categoryId: faker.helpers.arrayElement(resultCategories).id,
      imageUrl: faker.image.urlLoremFlickr({ width: 900, height: 900 }),
    });
  }

  for (let i = 0; i < 15; i++) {
    usersData.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      image: faker.image.avatar(),
      username: faker.internet.userName(),
    });
  }

  await db.insert(products).values(productsData);

  await db.insert(users).values(usersData);

  /* await db.$client.end(); */
};

const elMain = async() =>{

  const resultCategories = await db
    .insert(categories)
    .values(categoriesArray)
    .returning();

  const gamesObjects = gamesArray.map((object: IgamesObjects) => {
    return {
      name: object.name,
      price: object.price,
      description: object.description,
      type: 'digital',
      stock: object.stock,
      categoryId: resultCategories.find(
        (categorie) => categorie.name == object.category.toLowerCase(),
      )?.id,
      imageUrl: object.imageUrl,
    };
  }) as IgamesObjectsForDb[];

  await db.insert(products).values(gamesObjects);
}

elMain();
