"use client"

import { useUser } from '@/context/UserContext';
import BoosterOpening from '@/components/booster/BoosterOpening';
import AuthForm from '@/components/AuthForm';

export default function Home() {
    // On récupère le joueur depuis notre mémoire globale (Context)
    const { user } = useUser();

    return (
        <main className="min-h-screen p-8 flex flex-col items-center">
            {!user ? (
                // --- ÉCRAN DE CONNEXION ---
                <div className="flex flex-col items-center gap-4 mt-20">
                    <h1 className="text-4xl font-bold mb-4 font-cinzel">Grand Line Legends</h1>
                    <p className="mb-6">Connectez-vous pour commencer votre collection.</p>
                    <AuthForm />
                </div>
            ) : (
                // --- ÉCRAN DE JEU (Booster) ---
                <div className="w-full flex flex-col items-center">
                    {/* Barre d'information du joueur */}
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-xl mb-8 flex gap-6 items-center shadow-lg border border-slate-700">
                        <span className="text-lg">Joueur : <strong className="text-blue-400">{user.pseudo}</strong></span>
                        <span className="text-xl text-yellow-400 font-bold tracking-wider">💰 {user.berrys} Berrys</span>
                    </div>

                    <BoosterOpening />
                </div>
            )}
        </main>
    );
}