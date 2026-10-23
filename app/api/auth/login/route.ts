import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { users } from '@/server/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { pseudo } = body;

        // 1. Chercher l'utilisateur avec Drizzle (équivalent de SELECT * WHERE pseudo = ...)
        const existingUser = await db.select().from(users).where(eq(users.pseudo, pseudo));

        // 2. Vérifier si le tableau renvoyé est vide
        if (existingUser.length === 0) {
            return NextResponse.json({ error: "Joueur introuvable." }, { status: 404 });
        }

        // 3. Renvoyer les données du joueur connecté
        return NextResponse.json({ success: true, user: existingUser[0] }, { status: 200 });

    } catch (error) {
        console.error("Erreur détaillée lors de l'exécution de l'API :", error);
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
}