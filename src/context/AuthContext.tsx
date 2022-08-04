import { User, UserCredential } from 'firebase/auth';
import { createContext } from 'react';
export interface IUserContext {
  user: User | null;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
}

export const UserContext = createContext<IUserContext>(null!);
