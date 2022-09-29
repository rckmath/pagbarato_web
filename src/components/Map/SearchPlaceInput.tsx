import { TravelExplore } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { inputStyle } from '../CommonStyles';

type TextFieldVariant = 'filled' | 'standard' | 'outlined' | undefined;

interface SearchPlaceInputProps {
  placeholder: string;
  helperText: string;
  onPlaceChange: (params: google.maps.places.PlaceResult) => void;
  readOnly?: boolean;
  variant?: TextFieldVariant;
}

const options = {
  componentRestrictions: { country: 'br' },
  fields: ['address_components', 'geometry', 'icon', 'name', 'opening_hours'],
  strictBounds: false,
  types: ['food', 'health', 'point_of_interest', 'subpremise'],
};

const SearchPlaceInput: FunctionComponent<SearchPlaceInputProps> = (props) => {
  const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onPlaceChange = () => {
    if (props.onPlaceChange && searchBox) {
      const place = searchBox.getPlace();
      props.onPlaceChange(place);
    }
  };

  useEffect(() => {
    if (inputRef && inputRef.current) {
      setSearchBox(new google.maps.places.Autocomplete(inputRef.current, options));
    }
  }, [inputRef, props.readOnly]);

  useEffect(() => {
    if (searchBox && onPlaceChange) {
      searchBox.addListener('place_changed', onPlaceChange);
    }
  }, [searchBox]);

  useEffect(() => {
    return () => {
      if (searchBox) google.maps.event.clearInstanceListeners(searchBox);
    };
  }, []);

  return (
    <TextField
      disabled={!!props.readOnly}
      fullWidth
      sx={inputStyle}
      inputRef={inputRef}
      type="text"
      size="small"
      variant={props.variant}
      placeholder={props.placeholder}
      helperText={props.helperText}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <TravelExplore />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchPlaceInput;
