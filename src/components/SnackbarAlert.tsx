import { AlertProps, Alert as MuiAlert, Snackbar } from '@mui/material';
import { forwardRef, FunctionComponent } from 'react';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props: any, ref: any) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface SnackbarAlertProps {
  backgroundColor: '#012900' | '#B00020' | '#ffc933';
  text: string;
  open: boolean;
  handleClose: () => void;
}

const SnackbarAlert: FunctionComponent<SnackbarAlertProps> = ({ text, open, backgroundColor, handleClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={3500} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Alert sx={{ width: '100%', backgroundColor }} onClose={handleClose}>
        {text}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
