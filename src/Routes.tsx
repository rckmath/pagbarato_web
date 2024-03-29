import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

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

import UserCreation from './pages/Creation/User';
import PriceCreation from './pages/Creation/Price';
import ProductCreation from './pages/Creation/Product';
import EstablishmentCreation from './pages/Creation/Establishment';
import MainContentWrapper from './components/MainContentWrapper';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<ProtectedRoute />}>
        <Route element={<MainContentWrapper />}>
          <Route element={<HomePage />} index/>
          <Route element={<UserCreation />} path="users/new" />
          <Route element={<UserDetails />} path="users/:id" />
          <Route element={<UsersListing />} path="users" />
          <Route element={<EstablishmentCreation />} path="establishments/new" />
          <Route element={<EstablishmentDetails />} path="establishments/:id" />
          <Route element={<EstablishmentsListing />} path="establishments" />
          <Route element={<ProductCreation />} path="products/new" />
          <Route element={<ProductDetails />} path="products/:id" />
          <Route element={<ProductsListing />} path="products" />
          <Route element={<PriceCreation />} path="prices/new" />
          <Route element={<PriceDetails />} path="prices/:id" />
          <Route element={<PricesListing />} path="prices" />
          <Route element={<SettingsPage />} path="settings" />
        </Route>
      </Route>
      <Route path="login" element={<LoginPage />} />
    </Route>,
  ),
);

export default router;
