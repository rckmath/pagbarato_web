import { useState, FunctionComponent } from 'react';
import {
  DashboardRounded,
  ExpandCircleDown,
  GroupsRounded,
  LocalOfferRounded,
  SettingsRounded,
  ShoppingBasketRounded,
  StoreRounded,
} from '@mui/icons-material';

import LogoImage from '../assets/logo-white.png';
import SidebarItem from './SidebarItem';

interface SidebarProps {}

const Sidebar: FunctionComponent<SidebarProps> = () => {
  const [collapse, setCollapse] = useState(false);

  const Menus = [
    { title: 'Dashboard', gap: false, icon: <DashboardRounded /> },
    { title: 'Usuários', gap: true, icon: <GroupsRounded /> },
    { title: 'Estabelecimentos', gap: false, icon: <StoreRounded /> },
    { title: 'Produtos', gap: false, icon: <ShoppingBasketRounded /> },
    { title: 'Preços', gap: false, icon: <LocalOfferRounded /> },
    { title: 'Opções', gap: true, icon: <SettingsRounded /> },
  ];

  return (
    <div className={`top-0 left-0 fixed bg-primary-green ${collapse ? 'w-[5vw]' : 'w-[14vw]'}  h-full p-5 duration-300`}>
      <span
        className="absolute cursor-pointer -right-3 top-9 w-9 h-9 rounded-full text-center bg-primary-green"
        onClick={() => setCollapse(!collapse)}
      >
        <ExpandCircleDown
          fontSize="large"
          className={`text-gray-200 border-2 border-primary-green rounded-full ${collapse ? '-rotate-90 ' : 'rotate-90'}`}
        />
      </span>
      <img src={LogoImage} className="mx-auto object-center w-2/3"></img>

      <ul className="pt-6">
        {Menus.map((Menu, index) => (
          <SidebarItem title={Menu.title} gap={Menu.gap} icon={Menu.icon} key={index} index={index} collapse={collapse} />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
