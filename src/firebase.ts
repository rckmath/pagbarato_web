import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { config } from './config'

const app = initializeApp(config.firebaseConfig)

export const auth = getAuth(app)

export default app
