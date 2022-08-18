import { FunctionComponent, useState } from 'react';
import GoogleMapReact, { ClickEventValue } from 'google-map-react';

import { config } from '../../config';
import PinMarker from './PinMarker';

export interface ILatLong {
  title: string;
  lat: number;
  lng: number;
}

interface MapProps {
  defaultCenter: ILatLong;
  coordinates: ILatLong;
  zoomLevel: number;
  handleMapClick?: (value: ClickEventValue) => void;
}

const Map: FunctionComponent<MapProps> = ({ defaultCenter, coordinates, zoomLevel, handleMapClick }) => {
  const [showPinMarker, setShowPinMarker] = useState(false);

  const handleLoaded = () => {
    setShowPinMarker(true);
  };

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: config.googleMapsApiKey }}
      defaultCenter={defaultCenter}
      defaultZoom={zoomLevel}
      onTilesLoaded={handleLoaded}
      onClick={handleMapClick}
    >
      {showPinMarker && <PinMarker lat={coordinates.lat} lng={coordinates.lng} title={coordinates.title} />}
    </GoogleMapReact>
  );
};

export default Map;
