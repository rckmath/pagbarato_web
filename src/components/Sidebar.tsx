import { useState, FunctionComponent, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';

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

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

import LogoImage from '../assets/logo-white.png';
import SidebarItem from './SidebarItem';
import { UserAuth } from '../context/AuthProvider';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface SidebarProps {
  children: JSX.Element;
}

const Sidebar: FunctionComponent<SidebarProps> = ({ children }) => {
  const [collapse, setCollapse] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [selected, setSelected] = useState(0);

  const navigate = useNavigate();
  const { logOut } = UserAuth();

  const handleLogout = (logout = false) => {
    if (logout) logOut();
    setConfirmLogout(false);
  };

  const Menus = [
    { title: 'Dashboard', path: '/', gap: false, icon: <DashboardRounded fontSize="small" /> },
    { title: 'Usuários', path: '/users', gap: true, icon: <GroupsRounded fontSize="small" /> },
    { title: 'Estabelecimentos', path: '/establishments', gap: false, icon: <StoreRounded fontSize="small" /> },
    { title: 'Produtos', path: '/products', gap: false, icon: <ShoppingBasketRounded fontSize="small" /> },
    { title: 'Preços', path: '/prices', gap: false, icon: <LocalOfferRounded fontSize="small" /> },
    { title: 'Opções', path: '/settings', gap: true, icon: <SettingsRounded fontSize="small" /> },
  ];

  return (
    <div className="flex flex-1 flex-column">
      <div
        className={`top-0 left-0 relative bg-primary-green ${collapse ? 'w-[4vw]' : 'w-[14vw]'} h-screen p-4 z-40 ease-in-out duration-300`}
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

        <div className="flex text-center object-center justify-center origin-left duration-300">
          <ul className="mt-[2vw]">
            <>
              {Menus.map((Menu, index) => (
                <SidebarItem
                  title={Menu.title}
                  gap={Menu.gap}
                  icon={Menu.icon}
                  key={index}
                  index={index}
                  selected={selected}
                  collapse={collapse}
                  action={async () => {
                    setSelected(index);
                    navigate(Menu.path);
                  }}
                />
              ))}
              <SidebarItem
                title="Sair"
                gap={false}
                icon={<LogoutRounded fontSize="small" />}
                selected={selected}
                collapse={collapse}
                action={async () => {
                  setConfirmLogout(true);
                }}
              />
            </>
          </ul>
        </div>
        <Dialog
          open={confirmLogout}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => {
            handleLogout();
          }}
          aria-describedby="alert-dialog-slide-description"
          PaperProps={{ sx: { width: '33%', backgroundColor: '#367315' } }}
        >
          <DialogTitle color="white">{'Confirmar ação'}</DialogTitle>
          <DialogContent>
            <DialogContentText color="white" id="alert-dialog-slide-description">
              Deseja mesmo sair?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleLogout(true);
              }}
              style={{ backgroundColor: '#EF8F01', color: '#fff', margin: '8px 0' }}
            >
              Sim
            </Button>
            <Button
              onClick={() => {
                handleLogout();
              }}
              style={{ color: '#fff', margin: '8px 4px' }}
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;
