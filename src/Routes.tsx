import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthContextProvider } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/login';
import HomePage from './pages/home';
import UsersPage from './pages/users';
import PricesPage from './pages/prices';
import ProductsPage from './pages/products';
import SettingsPage from './pages/settings';
import EstablishmentsPage from './pages/establishments';

const AppRoutes = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <Sidebar>
                  <HomePage />
                </Sidebar>
              }
              path="/"
            />
            <Route
              element={
                <Sidebar>
                  <UsersPage />
                </Sidebar>
              }
              path="/users"
            />
            <Route
              element={
                <Sidebar>
                  <EstablishmentsPage />
                </Sidebar>
              }
              path="/establishments"
            />
            <Route
              element={
                <Sidebar>
                  <ProductsPage />
                </Sidebar>
              }
              path="/products"
            />
            <Route
              element={
                <Sidebar>
                  <PricesPage />
                </Sidebar>
              }
              path="/prices"
            />
            <Route
              element={
                <Sidebar>
                  <SettingsPage />
                </Sidebar>
              }
              path="/settings"
            />
          </Route>
          <Route path="/login" element={<LoginPage />}></Route>
        </Routes>
      </Router>
    </AuthContextProvider>
  );
};

export default AppRoutes;
