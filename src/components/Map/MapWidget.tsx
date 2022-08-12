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
  const correctedCoordinates: ILatLong = {
    lat: coordinates.lat < 0 ? coordinates.lat + 0.00015 : coordinates.lat - 0.00015,
    lng: coordinates.lng < 0 ? coordinates.lng - 0.000025 : coordinates.lng + 0.000025,
    title: coordinates.title,
  };

  return (
    <Popper id={id} open={open} placement="right" anchorEl={anchorEl} sx={{ border: 2, borderColor: '#36731535' }}>
      <div className="flex w-[380px] h-[240px]">
        <Map coordinates={correctedCoordinates} zoomLevel={17} />
      </div>
    </Popper>
  );
};

export default MapWidget;
