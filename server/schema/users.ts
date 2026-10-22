import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    pseudo: text('pseudo').notNull().unique(),
    berrys: integer('berrys').default(100),
});