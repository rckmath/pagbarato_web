import { FunctionComponent } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import useInterval from '../hooks/UseInterval';

import SidebarMenu from './Sidebar/SidebarMenu';

const REFRESH_SESSION_TIME_IN_MIN = 1000 * 60 * 45; // 1000ms * 60 = 60sec * 45 = 45min

interface MainContentWrapperProps {}

const MainContentWrapper: FunctionComponent<MainContentWrapperProps> = () => {
  const { user, refresh } = useAuth();

  useInterval(() => refresh(), user ? REFRESH_SESSION_TIME_IN_MIN : null);

  return (
    <div className="flex flex-row min-h-screen">
      <SidebarMenu />
      <main className="pl-[60px] pt-[60px] pr-[60px] w-full h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default MainContentWrapper;
