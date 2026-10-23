import {NextResponse} from 'next/server';
import {db} from '@/server/db';
import {users} from '@/server/schema';

export async function POST(request: Request) {
    try {
        // 1. Lire les données envoyées par React
        const body = await request.json();
        const {pseudo} = body;

        if (!pseudo) {
            return NextResponse.json({error: "Le pseudo est requis."}, {status: 400});
        }

        // 2. Insérer dans PostgreSQL avec Drizzle
        const newUser = await db.insert(users).values({
            pseudo: pseudo,
            // 'id' et 'berrys' sont générés automatiquement par vos valeurs par défaut
        }).returning(); // .returning() permet de récupérer la ligne venant d'être créée

        // 3. Renvoyer la réponse au front-end
        return NextResponse.json({success: true, user: newUser[0]}, {status: 201});

    } catch (error) {
        console.error("Ce pseudo existe déjà ou une erreur est survenue.:", error);
        return NextResponse.json({error: "Ce pseudo existe déjà ou une erreur est survenue."}, {status: 500});
    }
}