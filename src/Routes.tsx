import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthContextProvider } from './context/AuthProvider';
import SidebarMenu from './components/Sidebar/SidebarMenu';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import UsersPage from './pages/Users';
import PricesPage from './pages/Prices';
import ProductsPage from './pages/Products';
import SettingsPage from './pages/Settings';
import EstablishmentsPage from './pages/Establishments';

const AppRoutes = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<SidebarMenu />}>
              <Route element={<HomePage />} path="/" />
              <Route element={<UsersPage />} path="/users" />
              <Route element={<EstablishmentsPage />} path="/establishments" />
              <Route element={<ProductsPage />} path="/products" />
              <Route element={<PricesPage />} path="/prices" />
              <Route element={<SettingsPage />} path="/settings" />
            </Route>
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
};

export default AppRoutes;
