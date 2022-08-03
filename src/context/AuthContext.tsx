import { User, UserCredential } from 'firebase/auth'
import { createContext } from 'react'

const INITIAL_STATE = {
  user: JSON.parse(sessionStorage.getItem('user') as string) || null,
}

export interface IUserContext {
  user: User | null
  logIn?: (email: string, password: string) => Promise<UserCredential>
  logOut?: () => Promise<void>
}

export const UserContext = createContext<IUserContext>(INITIAL_STATE)
