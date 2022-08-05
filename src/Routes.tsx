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
import Sidebar from './components/Sidebar';

const AppRoutes = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <Sidebar initialSelected={0}>
                  <HomePage />
                </Sidebar>
              }
              path="/"
            />
            <Route
              element={
                <Sidebar initialSelected={1}>
                  <UsersPage />
                </Sidebar>
              }
              path="/users"
            />
            <Route
              element={
                <Sidebar initialSelected={2}>
                  <EstablishmentsPage />
                </Sidebar>
              }
              path="/establishments"
            />
            <Route
              element={
                <Sidebar initialSelected={3}>
                  <ProductsPage />
                </Sidebar>
              }
              path="/products"
            />
            <Route
              element={
                <Sidebar initialSelected={4}>
                  <PricesPage />
                </Sidebar>
              }
              path="/prices"
            />
            <Route
              element={
                <Sidebar initialSelected={5}>
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
