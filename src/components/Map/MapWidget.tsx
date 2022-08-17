import { Popper } from '@mui/material';
import { FunctionComponent } from 'react';
import Map, { ILatLong } from '.';

interface MapWidgetProps {
  id?: string;
  open: boolean;
  coordinates: ILatLong;
  anchorEl: null | HTMLElement;
}

const MapWidget: FunctionComponent<MapWidgetProps> = ({ id, open, coordinates, anchorEl }) => {
  return (
    <Popper id={id} open={open} placement="right" anchorEl={anchorEl} sx={{ border: 2, borderColor: '#36731535' }}>
      <div className="flex w-[380px] h-[240px]">
        <Map coordinates={coordinates} zoomLevel={18} />
      </div>
    </Popper>
  );
};

export default MapWidget;
