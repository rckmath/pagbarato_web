import { FunctionComponent } from 'react';

interface SidebarItemProps {
  index: number;
  title: string;
  gap: boolean;
  icon: JSX.Element;
  collapse: boolean;
}

const SidebarItem: FunctionComponent<SidebarItemProps> = (props) => {
  return (
    <li
      className={`flex rounded-md p-2 cursor-pointer hover:bg-primary-yellow text-gray-200 text-sm items-center gap-x-4 
      ${props.gap ? 'mt-9' : 'mt-2'} ${props.index === 0 && 'bg-primary-yellow'} `}
    >
      {props.icon}
      <span className={`${props.collapse && 'hidden'} origin-left duration-300`}>{props.title}</span>
    </li>
  );
};

export default SidebarItem;
