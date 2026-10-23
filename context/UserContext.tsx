"use client"

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

const UserContext = createContext<any>(null);

export function UserProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [user, setUser] = useState<any>(null);

    const contextValue = useMemo(() => ({ user, setUser }), [user]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}
export const useUser = () => useContext(UserContext);