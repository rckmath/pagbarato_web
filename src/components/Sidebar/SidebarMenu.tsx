import { useState, FunctionComponent, useEffect } from 'react';

import {
  DashboardRounded,
  ExpandCircleDown,
  GroupsRounded,
  LocalOfferRounded,
  LogoutRounded,
  ShoppingBasketRounded,
  StoreRounded,
} from '@mui/icons-material';

import LogoImage from '../../assets/logo-white.png';
import SidebarItem from './SidebarItem';
import { useAuth } from '../../context/AuthProvider';
import ConfirmDialog from '../ConfirmDialog';
import useWindowSize from '../../hooks/WindowSize';

const Menus = [
  { title: 'Dashboard', path: '/', gap: false, icon: <DashboardRounded fontSize="small" /> },
  { title: 'Usuários', path: '/users', gap: true, icon: <GroupsRounded fontSize="small" /> },
  { title: 'Estabelecimentos', path: '/establishments', gap: false, icon: <StoreRounded fontSize="small" /> },
  { title: 'Produtos', path: '/products', gap: false, icon: <ShoppingBasketRounded fontSize="small" /> },
  { title: 'Preços', path: '/prices', gap: false, icon: <LocalOfferRounded fontSize="small" /> },
];

interface SidebarMenuProps {}

const SidebarMenu: FunctionComponent<SidebarMenuProps> = () => {
  const [collapse, setCollapse] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const { logOut } = useAuth();
  const { width } = useWindowSize();

  const handleLogout = (logout = false) => {
    if (logout) logOut();
    setConfirmLogout(false);
  };

  useEffect(() => {
    if (width !== undefined && width <= 1190 && !collapse) setCollapse(true);
    if (width !== undefined && width > 1190 && collapse) setCollapse(false);
  }, [width]);

  return (
    <div className="flex flex-1 flex-grow">
      <div
        className={`top-0 left-0 relative bg-main-orange ${
          collapse ? 'min-w-[48px] max-w-[60px] w-[4vw]' : 'min-w-[180px] max-w-[200px] w-[14vw]'
        } ease-in-out min-h-screen p-4 z-40 duration-500`}
      >
        <span
          className="absolute cursor-pointer -right-3 top-16 w-9 h-9 rounded-full text-center bg-main-orange"
          onClick={() => setCollapse((state) => !state)}
        >
          <ExpandCircleDown
            fontSize="large"
            className={`text-gray-100 border-2 border-main-orange rounded-full ${collapse ? '-rotate-90 ' : 'rotate-90'}`}
          />
        </span>

        <div className="mx-auto sticky">
          <img src={LogoImage} className={`mx-auto only:min-w-[144px] w-[144px] ${collapse && 'invisible'}`} alt="logo" />
        </div>

        <div className="flex text-center object-center justify-center">
          <nav>
            <ul className="mt-[3.5vw]">
              <>
                {Menus.map((Menu, index) => (
                  <SidebarItem title={Menu.title} gap={Menu.gap} icon={Menu.icon} key={index} collapse={collapse} path={Menu.path} />
                ))}
                <SidebarItem
                  title="Sair"
                  gap={true}
                  icon={<LogoutRounded fontSize="small" />}
                  collapse={collapse}
                  action={() => setConfirmLogout(true)}
                />
              </>
            </ul>
          </nav>
        </div>
        <ConfirmDialog title="Confirmar ação" content="Deseja mesmo sair?" openDialog={confirmLogout} confirmAction={handleLogout} />
      </div>
    </div>
  );
};

export default SidebarMenu;
