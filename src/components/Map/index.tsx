import { FunctionComponent } from 'react';
import GoogleMapReact from 'google-map-react';

import './map.css';
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
  return (
    <GoogleMapReact bootstrapURLKeys={{ key: config.googleMapsApiKey }} defaultCenter={coordinates} defaultZoom={zoomLevel}>
      <PinMarker lat={coordinates.lat} lng={coordinates.lng} title={coordinates.title} />
    </GoogleMapReact>
  );
};

export default Map;
