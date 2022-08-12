import { IconButton, IconButtonProps, styled } from '@mui/material';

export const ColoredIconButton = styled(IconButton)<IconButtonProps>(({ theme: any }) => ({
  '&:hover': {
    backgroundColor: '#f69f0399',
  },
}));
