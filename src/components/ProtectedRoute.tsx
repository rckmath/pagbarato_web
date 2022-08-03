import { Outlet, Navigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthProvider'

const ProtectedRoute = () => {
  const { user } = UserAuth()

  return user ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoute
