import { LinearProgress } from '@mui/material';
import { styled } from '@mui/system';

export const ColoredLinearProgress = styled(LinearProgress)(({ theme: any }) => ({
  backgroundColor: '#dddddd',
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#fb5607',
  },
}));
