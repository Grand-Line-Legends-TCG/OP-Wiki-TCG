import { pgTable, uuid, integer, timestamp, unique } from 'drizzle-orm/pg-core';
import { users } from './users';
import { cards } from './cards';

export const collections = pgTable('collections', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    cardId: uuid('card_id')
        .references(() => cards.id, { onDelete: 'cascade' })
        .notNull(),
    quantity: integer('quantity').default(1).notNull(),
    obtainedAt: timestamp('obtained_at').defaultNow().notNull(),
}, (table) => ({
    // Crée une contrainte unique sur la combinaison joueur + carte
    uniqueUserCard: unique('unique_user_card').on(table.userId, table.cardId),
}));