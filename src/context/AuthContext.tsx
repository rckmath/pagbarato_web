import { createContext } from 'react';
import { User, UserCredential } from 'firebase/auth';
export interface IUserAuth extends User {
  accessToken?: string;
}
export interface IUserContext {
  user: IUserAuth | null;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
  refreshToken: () => void;
}

export const UserContext = createContext<IUserContext>(null!);
