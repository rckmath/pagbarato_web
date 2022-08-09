import { useContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, onIdTokenChanged} from 'firebase/auth';

import { auth } from '../firebase';
import { IUserAuth, UserContext } from './AuthContext';

export const AuthContextProvider = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<IUserAuth | null>(JSON.parse(sessionStorage.getItem('user') as string) || null);

  const logOut = () => {
    sessionStorage.removeItem('user');
    return signOut(auth);
  };

  const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const userData = currentUser as any;
      sessionStorage.setItem('user', JSON.stringify(currentUser));
      if (userData?.accessToken) sessionStorage.setItem('accessToken', userData.accessToken);
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  });

  return <UserContext.Provider value={{ user, logIn, logOut }}>{children}</UserContext.Provider>;
};

export const UserAuth = () => {
  return useContext(UserContext);
};
