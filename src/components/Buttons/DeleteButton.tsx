import { FunctionComponent } from 'react';
import { DeleteRounded } from '@mui/icons-material';
import { IconButton, IconButtonProps, styled } from '@mui/material';

const ColoredIconButton = styled(IconButton)<IconButtonProps>(({ theme: any }) => ({
  '&:hover': {
    backgroundColor: '#f69f03',
  },
}));

interface DeleteButtonProps {
  disabled: boolean;
  idToDelete?: string;
  action: (id?: string) => void;
}

const DeleteButton: FunctionComponent<DeleteButtonProps> = ({ disabled, idToDelete, action }) => {
  return (
    <ColoredIconButton
      size="small"
      aria-label="delete"
      disabled={disabled}
      onClick={() => {
        action(idToDelete);
      }}
    >
      <DeleteRounded />
    </ColoredIconButton>
  );
};

export default DeleteButton;
