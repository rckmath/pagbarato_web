import { useContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

import { auth } from '../firebase';
import { IUserAuth, UserContext } from './AuthContext';
import { getMe } from '../services/user';
import { UserRoleType } from '../models/user';

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

  const refresh = async () => {
    if (user) {
      user.getIdToken(true).then((token) => {
        sessionStorage.setItem('accessToken', token);
        if (auth.currentUser) sessionStorage.setItem('refreshToken', auth.currentUser.refreshToken);
        setUser(auth.currentUser);
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const userData = currentUser as any;

      if (userData?.accessToken) {

        if (!user?.userId) {
          const response = await getMe(userData.accessToken);
          if (response.role !== UserRoleType.ADMIN) return logOut();  
          userData.userId = response.id;
        }

        sessionStorage.setItem('accessToken', userData.accessToken);
      }

      if (userData?.refreshToken) sessionStorage.setItem('refreshToken', userData.refreshToken);

      sessionStorage.setItem('user', JSON.stringify(currentUser));

      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  });

  return <UserContext.Provider value={{ user, logIn, logOut, refresh }}>{children}</UserContext.Provider>;
};

export const useAuth = () => {
  return useContext(UserContext);
};
