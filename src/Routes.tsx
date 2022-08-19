import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthContextProvider } from './context/AuthProvider';
import SidebarMenu from './components/Sidebar/SidebarMenu';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import SettingsPage from './pages/Settings';

import UsersListing from './pages/Listing/Users';
import PricesListing from './pages/Listing/Prices';
import ProductsListing from './pages/Listing/Products';
import EstablishmentsListing from './pages/Listing/Establishments';

import UserDetails from './pages/Details/User';
import PriceDetails from './pages/Details/Price';
import ProductDetails from './pages/Details/Product';
import EstablishmentDetails from './pages/Details/Establishment';

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
                <Route element={<UsersListing />} path="users" />
                <Route element={<EstablishmentDetails />} path="establishments/:id" />
                <Route element={<EstablishmentsListing />} path="establishments" />
                <Route element={<ProductDetails />} path="products/:id" />
                <Route element={<ProductsListing />} path="products" />
                <Route element={<PriceDetails />} path="prices/:id" />
                <Route element={<PricesListing />} path="prices" />
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
