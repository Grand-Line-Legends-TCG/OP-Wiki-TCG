import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { users } from '@/server/schema/users';
import { cards } from '@/server/schema/cards';
import { collections } from '@/server/schema/collections';
import { eq, sql } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const { userId } = await request.json();

        // 1. Vérifier les fonds du joueur
        const user = await db.select().from(users).where(eq(users.id, userId));
        if (!user.length || user[0].berrys === null || user[0].berrys < 100) {
            return NextResponse.json({ error: "Fonds insuffisants (100 Berrys requis)." }, { status: 400 });
        }

        // 2. Déduire les Berrys
        const newBalance = user[0].berrys - 100;
        await db.update(users).set({ berrys: newBalance }).where(eq(users.id, userId));

        // 3. Tirer 5 cartes au hasard depuis la base de données
        const drawnCards = await db.select().from(cards).orderBy(sql`RANDOM()`).limit(5);

        // 4. Sauvegarder dans la collection du joueur (avec gestion des doublons)
        const insertPromises = drawnCards.map((card) => {
            return db.insert(collections)
                .values({
                    userId: userId,
                    cardId: card.id,
                    quantity: 1,
                })
                .onConflictDoUpdate({
                    target: [collections.userId, collections.cardId],
                    set: {
                        quantity: sql`${collections.quantity} + 1`,
                    },
                });
        });

        await Promise.all(insertPromises);

        return NextResponse.json({ success: true, cards: drawnCards, newBalance });
    } catch (error) {
        console.error(error); // Utile pour voir l'erreur exacte dans le terminal du serveur
        return NextResponse.json({ error: "Erreur lors de l'ouverture du booster." }, { status: 500 });
    }
}