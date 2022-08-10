import { useState, FunctionComponent } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import {
  DashboardRounded,
  ExpandCircleDown,
  GroupsRounded,
  LocalOfferRounded,
  LogoutRounded,
  SettingsRounded,
  ShoppingBasketRounded,
  StoreRounded,
} from '@mui/icons-material';

import LogoImage from '../../assets/logo-white.png';
import SidebarItem from './SidebarItem';
import { useAuth } from '../../context/AuthProvider';
import ConfirmDialog from '../ConfirmDialog';

const Menus = [
  { title: 'Dashboard', path: '/', gap: false, icon: <DashboardRounded fontSize="small" /> },
  { title: 'Usuários', path: '/users', gap: true, icon: <GroupsRounded fontSize="small" /> },
  { title: 'Estabelecimentos', path: '/establishments', gap: false, icon: <StoreRounded fontSize="small" /> },
  { title: 'Produtos', path: '/products', gap: false, icon: <ShoppingBasketRounded fontSize="small" /> },
  { title: 'Preços', path: '/prices', gap: false, icon: <LocalOfferRounded fontSize="small" /> },
  { title: 'Opções', path: '/settings', gap: true, icon: <SettingsRounded fontSize="small" /> },
];

interface SidebarProps {}

const Sidebar: FunctionComponent<SidebarProps> = () => {
  const [collapse, setCollapse] = useState(false);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const navigate = useNavigate();
  const { logOut } = useAuth();

  const handleLogout = (logout = false) => {
    if (logout) logOut();
    setConfirmLogout(false);
  };

  return (
    <div className="flex flex-1 flex-column">
      <div
        className={`top-0 left-0 relative bg-primary-green ${collapse ? 'w-[4vw]' : 'w-[14vw]'} h-screen p-4 z-40 ease-in-out duration-500`}
      >
        <span
          className="absolute cursor-pointer -right-3 top-16 w-9 h-9 rounded-full text-center bg-primary-green"
          onClick={() => setCollapse(!collapse)}
        >
          <ExpandCircleDown
            fontSize="large"
            className={`text-gray-100 border-2 border-primary-green rounded-full ${collapse ? '-rotate-90 ' : 'rotate-90'}`}
          />
        </span>

        <div className="mx-auto sticky">
          <img src={LogoImage} className={`mx-auto only:min-w-[144px] w-[144px] ${collapse && 'invisible'}`} alt="logo" />
        </div>

        <div className="flex text-center object-center justify-center">
          <ul className="mt-[2vw]">
            <>
              {Menus.map((Menu, index) => (
                <SidebarItem
                  title={Menu.title}
                  gap={Menu.gap}
                  icon={Menu.icon}
                  key={index}
                  index={index}
                  selected={selectedMenuIndex}
                  collapse={collapse}
                  action={() => {
                    setSelectedMenuIndex(index);
                    navigate(Menu.path);
                  }}
                />
              ))}
              <SidebarItem
                title="Sair"
                gap={false}
                icon={<LogoutRounded fontSize="small" />}
                selected={selectedMenuIndex}
                collapse={collapse}
                action={() => setConfirmLogout(true)}
              />
            </>
          </ul>
        </div>
        <ConfirmDialog title="Confirmar ação" content="Deseja mesmo sair?" openDialog={confirmLogout} confirmAction={handleLogout} />
      </div>
      <main className="pl-[60px] pt-[60px] pr-[60px] w-full h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Sidebar;
