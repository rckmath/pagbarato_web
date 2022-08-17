import { useContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

import { auth } from '../firebase';
import { IUserAuth, UserContext } from './AuthContext';

export const AuthContextProvider = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<IUserAuth | null>(JSON.parse(sessionStorage.getItem('user') as string) || null);

  const logOut = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    return signOut(auth);
  };

  const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const refreshToken = () => {
    if (user) {
      user.getIdToken(true).then((x) => {
        sessionStorage.setItem('accessToken', x);
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userData = currentUser as any;
        sessionStorage.setItem('user', JSON.stringify(currentUser));
        if (userData?.accessToken) sessionStorage.setItem('accessToken', userData.accessToken);
        if (userData?.refreshToken) sessionStorage.setItem('refreshToken', userData.refreshToken);
      } else {
        user?.getIdToken(true);
      }

      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  });

  return <UserContext.Provider value={{ user, logIn, logOut, refreshToken }}>{children}</UserContext.Provider>;
};

export const useAuth = () => {
  return useContext(UserContext);
};
