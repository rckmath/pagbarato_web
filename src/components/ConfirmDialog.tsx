import { forwardRef, FunctionComponent } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ConfirmDialogProps {
  title: string;
  content: string;
  openDialog: boolean;
  confirmAction: (confirm?: boolean) => void;
}

const ConfirmDialog: FunctionComponent<ConfirmDialogProps> = ({ title, content, openDialog, confirmAction }) => {
  return (
    <Dialog
      open={openDialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => {
        confirmAction();
      }}
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{ sx: { width: '33%', backgroundColor: '#fb5607' } }}
    >
      <DialogTitle color="white">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText color="white">{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            confirmAction(true);
          }}
          style={{ backgroundColor: '#012900', color: '#fff', margin: '8px 0' }}
        >
          Sim
        </Button>
        <Button
          onClick={() => {
            confirmAction();
          }}
          style={{ color: '#fff', margin: '8px 4px' }}
        >
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
