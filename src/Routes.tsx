import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthContextProvider } from './context/AuthProvider';
import SidebarMenu from './components/Sidebar/SidebarMenu';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import SettingsPage from './pages/Settings';

import UsersPage from './pages/Listing/Users';
import PricesPage from './pages/Listing/Prices';
import ProductsPage from './pages/Listing/Products';
import EstablishmentsPage from './pages/Listing/Establishments';

import UserDetails from './pages/Details/UserDetails';

const AppRoutes = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/">
            <Route element={<ProtectedRoute />}>
              <Route element={<SidebarMenu />}>
                <Route index element={<HomePage />} />
                <Route element={<UserDetails />} path="users/:id" />
                <Route element={<UsersPage />} path="users" />
                <Route element={<EstablishmentsPage />} path="establishments" />
                <Route element={<ProductsPage />} path="products" />
                <Route element={<PricesPage />} path="prices" />
                <Route element={<SettingsPage />} path="settings" />
              </Route>
            </Route>
            <Route path="login" element={<LoginPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthContextProvider>
  );
};

export default AppRoutes;
