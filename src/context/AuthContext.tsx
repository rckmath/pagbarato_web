import { createContext } from 'react';
import { User, UserCredential } from 'firebase/auth';
export interface IUserAuth extends User {
  userId?: string;
  accessToken?: string;
}
export interface IUserContext {
  user: IUserAuth | null;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const UserContext = createContext<IUserContext>(null!);
