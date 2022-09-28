import { Tooltip, TooltipProps, tooltipClasses, styled } from '@mui/material';

export const LargerTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 220,
    textAlign: 'center',
  },
});