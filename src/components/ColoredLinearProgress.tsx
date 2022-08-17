import { LinearProgress } from '@mui/material';
import { styled } from '@mui/system';

export const ColoredLinearProgress = styled(LinearProgress)(({ theme: any }) => ({
  backgroundColor: '#dddddd',
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#ef8f01',
  },
}));
