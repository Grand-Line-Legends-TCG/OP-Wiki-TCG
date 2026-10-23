import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    pseudo: text('pseudo').notNull().unique(),
    berrys: integer('berrys').default(100),
});