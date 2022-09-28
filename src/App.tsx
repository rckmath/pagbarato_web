import { FunctionComponent } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthProvider';
import router from './Routes';

interface AppProps {}

const App: FunctionComponent<AppProps> = () => {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
};

export default App;
