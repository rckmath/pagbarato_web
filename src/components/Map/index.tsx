import { FunctionComponent, useState } from 'react';
import GoogleMapReact from 'google-map-react';

import { config } from '../../config';
import PinMarker from './PinMarker';

export interface ILatLong {
  title: string;
  lat: number;
  lng: number;
}

interface MapProps {
  coordinates: ILatLong;
  zoomLevel: number;
}

const Map: FunctionComponent<MapProps> = ({ coordinates, zoomLevel }) => {
  const [showPinMarker, setShowPinMarker] = useState(false);

  const handleApiLoaded = () => {
    setShowPinMarker(true);
  };

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: config.googleMapsApiKey }}
      defaultCenter={coordinates}
      defaultZoom={zoomLevel}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={handleApiLoaded}
    >
      {showPinMarker && <PinMarker lat={coordinates.lat} lng={coordinates.lng} title={coordinates.title} />}
    </GoogleMapReact>
  );
};

export default Map;
