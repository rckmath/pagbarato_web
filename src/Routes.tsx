import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthContextProvider } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/login/page';
import HomePage from './pages/home/page';
import Sidebar from './components/Sidebar';

const AppRoutes = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <>
                  <Sidebar>
                    <HomePage />
                  </Sidebar>
                </>
              }
              path="/home"
            />
          </Route>
          <Route path="/" element={<LoginPage />}></Route>
        </Routes>
      </Router>
    </AuthContextProvider>
  );
};

export default AppRoutes;
