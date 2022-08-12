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
    <MarkerTooltip title={title} placement="top">
      <div className="flex justify-start items-start w-[2rem]">
        <div className="rounded-b-3xl rounded-t-sm p-[0.125rem] flex flex-col bg-opacity-75 bg-primary-green text-white text-left">
          <Store fontSize="inherit" />
          <KeyboardArrowDown fontSize="inherit" />
        </div>
      </div>
    </MarkerTooltip>
  );
};

export default PinMarker;
