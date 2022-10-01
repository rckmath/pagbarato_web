import { Close } from '@mui/icons-material';
import { Popper, Typography } from '@mui/material';
import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import Map, { ILatLong } from '.';
import { ColoredIconButton } from '../Buttons/ColoredIconButton';

interface MapWidgetProps {
  id?: string;
  open: boolean;
  coordinates: ILatLong;
  anchorEl: null | HTMLElement;
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
}

const MapWidget: FunctionComponent<MapWidgetProps> = ({ id, open, coordinates, anchorEl, setAnchorEl }) => {
  return (
    <Popper id={id} open={open} placement="right" anchorEl={anchorEl} sx={{ border: 2, borderRadius: 1, borderColor: '#aaa6' }}>
      <div className="flex bg-main-orange p-1 items-center text-white">
        <Typography marginLeft={1} variant="subtitle2" display="block">
          Localização
        </Typography>
        <ColoredIconButton size="small" sx={{ color: '#fff', marginLeft: 'auto' }} onClick={() => setAnchorEl(null)}>
          <Close fontSize="inherit" />
        </ColoredIconButton>
      </div>

      <div className="flex w-[380px] h-[240px]">
        <Map defaultCenter={coordinates} coordinates={coordinates} defaultZoomLevel={18} />
      </div>
    </Popper>
  );
};

export default MapWidget;
