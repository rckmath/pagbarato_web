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
      className={`flex rounded-lg p-2.5 cursor-pointer hover:bg-secondary-yellow duration-150 text-gray-100 text-sm gap-x-3
        ${props.gap ? 'mt-9' : 'mt-2'} ${props.index === props.selected && 'bg-primary-yellow'}`}
      onClick={props.action}
    >
      {props.icon}
      <span className={`${props.collapse ? 'hidden' : 'inline-block'}`}>{props.title}</span>
    </li>
  );
};

export default SidebarItem;
