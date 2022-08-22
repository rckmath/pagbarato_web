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
  recentralize?: boolean;
  defaultCenter: ILatLong;
  defaultZoomLevel: number;
  coordinates: ILatLong;
  zoomLevel?: number | null;
  handleMapClick?: (value: ClickEventValue) => void;
}

export interface RecentralizeProps {
  center: ILatLong;
}

const Map: FunctionComponent<MapProps> = ({ defaultCenter, defaultZoomLevel, coordinates, zoomLevel, recentralize, handleMapClick }) => {
  const [showPinMarker, setShowPinMarker] = useState(false);

  const handleLoaded = () => {
    setShowPinMarker(true);
  };

  const recentralizeProps: RecentralizeProps = {
    center: {
      title: '',
      lat: coordinates.lat && coordinates.lng ? coordinates.lat : defaultCenter.lat,
      lng: coordinates.lat && coordinates.lng ? coordinates.lng : defaultCenter.lng,
    },
  };

  const props = recentralize ? recentralizeProps : undefined;

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: config.googleMapsApiKey, libraries: ['places'] }}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoomLevel}
      onTilesLoaded={handleLoaded}
      onClick={handleMapClick}
      zoom={recentralize && coordinates.lat && coordinates.lng && zoomLevel ? zoomLevel : defaultZoomLevel}
      {...props}
    >
      {showPinMarker && <PinMarker lat={coordinates.lat} lng={coordinates.lng} title={coordinates.title} />}
    </GoogleMapReact>
  );
};

export default Map;
