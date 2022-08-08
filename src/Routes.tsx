import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthContextProvider } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/login';
import HomePage from './pages/home';
import UsersPage from './pages/users';
import PricesPage from './pages/prices';
import ProductsPage from './pages/products';
import SettingsPage from './pages/settings';
import EstablishmentsPage from './pages/establishments';
import SidebarMenu from './components/Sidebar/SidebarMenu';

const AppRoutes = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <SidebarMenu currentMenu={0}>
                  <HomePage />
                </SidebarMenu>
              }
              path="/"
            />
            <Route
              element={
                <SidebarMenu currentMenu={1}>
                  <UsersPage />
                </SidebarMenu>
              }
              path="/users"
            />
            <Route
              element={
                <SidebarMenu currentMenu={2}>
                  <EstablishmentsPage />
                </SidebarMenu>
              }
              path="/establishments"
            />
            <Route
              element={
                <SidebarMenu currentMenu={3}>
                  <ProductsPage />
                </SidebarMenu>
              }
              path="/products"
            />
            <Route
              element={
                <SidebarMenu currentMenu={4}>
                  <PricesPage />
                </SidebarMenu>
              }
              path="/prices"
            />
            <Route
              element={
                <SidebarMenu currentMenu={5}>
                  <SettingsPage />
                </SidebarMenu>
              }
              path="/settings"
            />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
};

export default AppRoutes;
