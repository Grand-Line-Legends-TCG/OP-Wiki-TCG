import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { collections } from '@/server/schema/collections';
import { cards } from '@/server/schema/cards';
import { eq } from 'drizzle-orm';

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const userId = params.userId;

        const userCards = await db
            .select({
                collectionId: collections.id,
                quantity: collections.quantity,
                obtainedAt: collections.obtainedAt,
                card: cards
            })
            .from(collections)
            .innerJoin(cards, eq(collections.cardId, cards.id))
            .where(eq(collections.userId, userId));

        return NextResponse.json({ success: true, collection: userCards }, { status: 200 });
    } catch (error) {
    console.error("Impossible de charger la collection:", error);
    return NextResponse.json({ error: "Impossible de charger la collection." }, { status: 500 });
}
}