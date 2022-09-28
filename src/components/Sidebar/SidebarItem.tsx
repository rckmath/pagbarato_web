import { FunctionComponent } from 'react';
import { NavLink } from 'react-router-dom';

const sidebarItemClass =
  'flex rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-secondary-yellow duration-150 text-gray-100 text-sm gap-x-3';
const activeClass = sidebarItemClass + ' ' + 'bg-primary-yellow';

interface SidebarTitleProps {
  collapse: boolean;
  title: string;
  icon: JSX.Element;
}

interface SidebarItemProps extends SidebarTitleProps {
  gap: boolean;
  path?: string;
  action?: () => any;
}

const SidebarTitle: FunctionComponent<SidebarTitleProps> = ({ icon, collapse, title }) => {
  return (
    <>
      {icon}
      <span className={`${collapse ? 'hidden' : 'inline-block'}`}>{title}</span>
    </>
  );
};

const SidebarItem: FunctionComponent<SidebarItemProps> = (props) => {
  return (
    <li className={`${!props.path && sidebarItemClass} ${props.gap ? 'mt-9' : 'mt-2'}`} onClick={props.action}>
      {props.path ? (
        <NavLink to={props.path} className={({ isActive }) => (isActive ? activeClass : sidebarItemClass)}>
          <SidebarTitle icon={props.icon} title={props.title} collapse={props.collapse} />
        </NavLink>
      ) : (
        <SidebarTitle icon={props.icon} title={props.title} collapse={props.collapse} />
      )}
    </li>
  );
};

export default SidebarItem;
