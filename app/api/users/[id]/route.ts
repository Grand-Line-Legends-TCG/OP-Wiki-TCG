import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { users } from '@/server/schema/users';
import { eq } from 'drizzle-orm';

// MODIFIER UN JOUEUR (ex: changer son pseudo)
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { pseudo } = await request.json();

        const updatedUser = await db
            .update(users)
            .set({ pseudo })
            .where(eq(users.id, params.id))
            .returning();

        return NextResponse.json({ success: true, user: updatedUser[0] });
    } catch (error) {
    // On garde une trace de l'erreur dans le terminal du serveur pour pouvoir déboguer
    console.error("Erreur détaillée lors de l'authentification :", error);

    // On renvoie un message générique et propre au front-end
    return NextResponse.json({ error: "Erreur lors de l'authentification." }, { status: 500 });
}
}

// SUPPRIMER UN JOUEUR
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Note : Si des cartes sont liées à ce joueur dans "collections",
        // il faudra soit les supprimer en premier, soit configurer un "ON DELETE CASCADE" dans votre schéma Drizzle.
        await db.delete(users).where(eq(users.id, params.id));

        return NextResponse.json({ success: true, message: "Compte supprimé." });
    } catch (error) {
    console.error("Erreur détaillée lors de la suppression :", error);
    return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
}
}