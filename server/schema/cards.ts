import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core';

export const cards = pgTable('cards', {
    id: uuid('id').primaryKey().defaultRandom(),
    pageid: integer('pageid').notNull().unique(),
    title: text('title').notNull(),
    rarity: text('rarity').notNull(),
    image: text('image'),
    description: text('description').notNull(),
});