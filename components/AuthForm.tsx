"use client"

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import '@fontsource/bangers/400.css';
import '@fontsource/cinzel/400.css';
import '@fontsource/cinzel/700.css';
// On importe le CSS du booster pour réutiliser la classe .booster-btn
import '@/components/booster/booster.css';

export default function AuthForm() {
    const [pseudo, setPseudo] = useState('');
    const { setUser } = useUser();

    const handleAuth = async (endpoint: 'login' | 'register') => {
        if (!pseudo.trim()) {
            alert("Veuillez entrer un pseudo.");
            return;
        }

        try {
            const res = await fetch(`/api/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pseudo })
            });

            const data = await res.json();

            if (data.success) {
                setUser(data.user);
            } else {
                alert(data.error);
            }
        } catch (error) {
        console.error("Erreur lors de la requête d'authentification :", error);
        alert("Erreur de connexion au serveur.");
    }
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w-sm mx-auto mb-8 p-6 bg-slate-900/80 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-sm">

            <div className="flex flex-col gap-2">
                <label htmlFor="pseudo" className="text-yellow-500 font-cinzel text-center text-lg tracking-widest">
                    Identité du Pirate
                </label>
                <input
                    id="pseudo"
                    type="text"
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    placeholder="Ex: Mugiwara..."
                    className="w-full text-center px-4 py-3 bg-slate-950 border-2 border-slate-700 rounded-lg text-white font-cinzel text-xl focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-slate-600"
                    onKeyDown={(e) => e.key === 'Enter' && handleAuth('login')}
                />
            </div>

            <div className="flex flex-col gap-3">
                {/* On réutilise la classe booster-btn de votre fichier CSS */}
                <button
                    onClick={() => handleAuth('login')}
                    className="booster-btn !w-full"
                >
                    Prendre la mer (Connexion)
                </button>

                <button
                    onClick={() => handleAuth('register')}
                    className="booster-btn !w-full"
                    style={{ filter: 'hue-rotate(180deg)' }} // Petite astuce pour changer la couleur du bouton d'inscription tout en gardant le même style
                >
                    Créer un équipage (Inscription)
                </button>
            </div>
        </div>
    );
}