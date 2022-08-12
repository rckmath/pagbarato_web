import { KeyboardArrowDown, Store } from '@mui/icons-material';
import { FunctionComponent } from 'react';
import './map.css';

interface PinMarkerProps {
  text: string;
}

const PinMarker: FunctionComponent<PinMarkerProps> = ({ text }) => {
  return (
    <div className="pin">
      <div className="pin-icon">
        <Store fontSize='medium' />
        <KeyboardArrowDown fontSize='small'/>
      </div>
      <p className="pin-text">{text}</p>
    </div>  
  );
};

export default PinMarker;
