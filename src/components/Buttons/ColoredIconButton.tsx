import { IconButton, IconButtonProps, styled } from '@mui/material';

export const ColoredIconButton = styled(IconButton)<IconButtonProps>(({ theme: any }) => ({
  '&:hover': {
    backgroundColor: '#fb560799',
  },
}));
