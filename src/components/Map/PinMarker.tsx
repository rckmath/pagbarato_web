import { KeyboardArrowDown, Store } from '@mui/icons-material';
import { Tooltip, TooltipProps, tooltipClasses, styled } from '@mui/material';
import { FunctionComponent } from 'react';

import { ILatLong } from './';

const MarkerTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 220,
    textAlign: 'center',
  },
});

interface PinMarkerProps extends ILatLong {}

const PinMarker: FunctionComponent<PinMarkerProps> = ({ title }) => {
  return (
    <MarkerTooltip title={title} placement="top" arrow>
      <div className="absolute -translate-y-2/4 -translate-x-2/4 hover:z-[1] select-none hover:cursor-pointer">
        <div className="rounded-b-3xl rounded-t-sm p-[0.25rem] flex flex-col flex-1 bg-primary-green text-white text-center items-center">
          <Store fontSize="inherit" />
          <KeyboardArrowDown fontSize="inherit" />
        </div>
      </div>
    </MarkerTooltip>
  );
};

export default PinMarker;
