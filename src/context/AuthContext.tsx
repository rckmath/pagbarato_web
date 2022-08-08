import { createContext } from 'react';
import { User, UserCredential } from 'firebase/auth';

export interface IUserContext {
  user: User | null;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
}

export const UserContext = createContext<IUserContext>(null!);
