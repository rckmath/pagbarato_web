import { AxiosError } from 'axios';
import { Chip, Divider, Grid, Paper, TextField, Tooltip, MenuItem, SelectChangeEvent, InputAdornment, Box } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, FunctionComponent, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Info, Send } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { useAuth } from '../../context/AuthProvider';
import SnackbarAlert from '../../components/SnackbarAlert';
import { createProduct } from '../../services/product';
import { ColoredIconButton } from '../../components/Buttons/ColoredIconButton';
import { ColoredLinearProgress } from '../../components/ColoredLinearProgress';
import { errorDispatcher, IBaseResponse } from '../../services/api';
import { ProductForm, ProductUnitMap } from '../../models/product';
import { btnStyle, inputStyle } from '../../components/commonStyles';

interface ProductDetailsProps {}

const ProductDetails: FunctionComponent<ProductDetailsProps> = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [showCreateSuccessMessage, setShowCreateSuccessMessage] = useState(false);
  const [productForm, setProductForm] = useState<ProductForm>({
    name: '',
    createdAt: '',
    unit: 'EA',
  });

  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const queryClient = useQueryClient();
  const accessToken = user != undefined && user ? (user.accessToken as string) : sessionStorage.getItem('accessToken');

  const productMutation = useMutation((productForm: ProductForm) => createProduct(productForm, { accessToken }), {
    onSuccess: ({ id }) => {
      setShowCreateSuccessMessage(true);
      queryClient.invalidateQueries(['productsList']);
      setTimeout(() => {
        navigate(`/products/${id}`);
      }, 750);
    },
    onError: (err) => errorDispatcher(err as AxiosError<IBaseResponse>, refresh),
  });

  const handleGoBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/products', { replace: true });
    }
  };

  const handleForm = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>, param: string) => {
    setProductForm({
      ...productForm,
      [param]: e.target.value,
    });
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await productMutation.mutateAsync(productForm);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleMessageClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowCreateSuccessMessage(false);
    setErrorMessage('');
  };

  return (
    <div className="flex flex-col w-full ">
      <h1 className="text-3xl font-bold mb-2 text-[#00000090]">Detalhes</h1>
      <hr />
      <Paper sx={{ paddingX: '2.5rem', paddingY: '1rem', marginTop: '1.5rem', minWidth: 400 }} elevation={2}>
        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          <Grid container>
            <Grid item xs={12} sm={6} textAlign="left">
              <Tooltip title="Voltar para listagem" placement="top" arrow>
                <ColoredIconButton size="medium" onClick={handleGoBack} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.06)' }}>
                  <ArrowBack fontSize="small" />
                </ColoredIconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={24} sm={12}>
              <Divider>
                <Chip icon={<Info />} sx={{ color: '#00000090' }} label="DADOS DO PRODUTO" />
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                variant="outlined"
                sx={inputStyle}
                type="text"
                label="Nome"
                value={productForm.name}
                placeholder="Nome do produto"
                onChange={(e) => handleForm(e, 'name')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                select
                variant="outlined"
                sx={inputStyle}
                label="Unidade do produto"
                value={productForm?.unit || null}
                placeholder="Unidade do produto"
                onChange={(e) => handleForm(e, 'unit')}
              >
                {ProductUnitMap.map((unitType) => {
                  return (
                    <MenuItem key={unitType[0]} value={unitType[0]}>
                      {unitType[1]}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={4} paddingTop={2}>
            <Grid item xs={24} sm={12} textAlign="right">
              <LoadingButton endIcon={<Send />} loading={productMutation.isLoading} type="submit" variant="contained" style={btnStyle}>
                Salvar
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      {productMutation.isLoading && <ColoredLinearProgress />}
      <SnackbarAlert
        backgroundColor="#367315"
        open={showCreateSuccessMessage}
        text="Produto criado com sucesso"
        handleClose={handleMessageClose}
      />
      <SnackbarAlert backgroundColor="#B00020" open={!!errorMessage} text={errorMessage} handleClose={handleMessageClose} />
    </div>
  );
};

export default ProductDetails;
