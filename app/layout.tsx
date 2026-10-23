import { UserProvider } from '@/context/UserContext';
import './globals.css'; // Assurez-vous d'importer votre CSS global

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="fr">
        <body>
        {/* C'est cette balise qui donne accès à la mémoire à toutes les pages */}
        <UserProvider>
            {children}
        </UserProvider>
        </body>
        </html>
    );
}