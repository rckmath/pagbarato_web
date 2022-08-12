import { Tooltip } from '@mui/material';
import { FunctionComponent, MouseEvent } from 'react';
import { ColoredIconButton } from './ColoredIconButton';

interface IconButtonWithTooltipProps {
  icon: JSX.Element;
  tooltipTitle: string;
  buttonSize: 'small' | 'medium' | 'large' | undefined;
  tooltipPlacement:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top'
    | undefined;
  action?: (event: MouseEvent<HTMLElement>) => void;
}

const IconButtonWithTooltip: FunctionComponent<IconButtonWithTooltipProps> = (props) => {
  return (
    <Tooltip title={props.tooltipTitle} placement={props.tooltipPlacement} arrow>
      <span style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
        <ColoredIconButton size={props.buttonSize} onClick={(event: MouseEvent<HTMLElement>) => props.action && props.action(event)}>
          {props.icon}
        </ColoredIconButton>
      </span>
    </Tooltip>
  );
};

export default IconButtonWithTooltip;
