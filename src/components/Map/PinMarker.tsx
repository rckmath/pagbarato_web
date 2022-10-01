import { FunctionComponent } from 'react';
import { KeyboardArrowDown, Store } from '@mui/icons-material';

import { LargerTooltip } from '../LargerTooltip';

import { ILatLong } from './';

interface PinMarkerProps extends ILatLong {}

const PinMarker: FunctionComponent<PinMarkerProps> = ({ title }) => {
  return (
    <LargerTooltip title={title} placement="top" arrow>
      <div className="absolute -translate-y-2/4 -translate-x-2/4 hover:z-[1] select-none hover:cursor-pointer">
        <div className="rounded-b-3xl rounded-t-sm p-[0.25rem] flex flex-col flex-1 bg-main-orange text-white text-center items-center">
          <Store fontSize="inherit" />
          <KeyboardArrowDown fontSize="inherit" />
        </div>
      </div>
    </LargerTooltip>
  );
};

export default PinMarker;
