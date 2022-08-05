import { FunctionComponent } from 'react';

interface SidebarItemProps {
  index?: number;
  selected?: number;
  gap: boolean;
  collapse: boolean;
  title: string;
  icon: JSX.Element;
  action: () => Promise<any>;
}

const SidebarItem: FunctionComponent<SidebarItemProps> = (props) => {
  return (
    <li
      className={`flex rounded-sm p-2 cursor-pointer hover:bg-primary-yellow text-gray-100 text-sm gap-x-4 duration-200 origin-left
      ${props.gap ? 'mt-9' : 'mt-2'} ${props.index === props.selected && 'bg-primary-yellow'}`}
      onClick={props.action}
    >
      {props.icon}
      <span className={`${props.collapse && 'hidden'} origin-left duration-300`}>{props.title}</span>
    </li>
  );
};

export default SidebarItem;
