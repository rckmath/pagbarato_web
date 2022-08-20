import ptBRLocale from 'date-fns/locale/pt-BR';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AxiosError } from 'axios';
import { Chip, Divider, Grid, Paper, TextField, Tooltip, MenuItem, SelectChangeEvent, InputAdornment } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, FunctionComponent, SyntheticEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack, Edit, EditOff, Info, Send } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { useAuth } from '../../context/AuthProvider';
import SnackbarAlert from '../../components/SnackbarAlert';
import { getProductById, updateProduct } from '../../services/product';
import { ColoredIconButton } from '../../components/Buttons/ColoredIconButton';
import { ColoredLinearProgress } from '../../components/ColoredLinearProgress';
import { errorDispatcher, IBaseResponse } from '../../services/api';
import { Product, ProductForm, ProductUnitMap } from '../../models/product';

const inputStyle = {
  paddingBottom: 1,
  '& label.Mui-focused': {
    color: '#EF8F01',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#EF8F01',
  },
  '& .MuiOutlinedInput-root.Mui-focused': {
    '& > fieldset': { borderColor: '#EF8F01' },
  },
  '& .MuiFilledInput-underline:after': {
    borderBottomColor: '#EF8F01',
  },
};

const btnStyle = { backgroundColor: '#f69f03', margin: '8px 0' };

type TextFieldVariant = 'filled' | 'standard' | 'outlined' | undefined;

interface ProductDetailsProps {}

const ProductDetails: FunctionComponent<ProductDetailsProps> = () => {
  const [edit, setEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showUpdateSuccessMessage, setShowUpdateSuccessMessage] = useState(false);
  const [productForm, setProductForm] = useState<ProductForm>({
    name: '',
    createdAt: '',
    unit: 'EA',
  });

  const params = useParams();
  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const queryClient = useQueryClient();
  const fieldVariant: TextFieldVariant = edit ? 'outlined' : 'filled';
  const accessToken = user != undefined && user ? (user.accessToken as string) : sessionStorage.getItem('accessToken');

  const { isFetching } = useQuery<Product>(['product', params.id], () => getProductById(params.id as string, { accessToken }), {
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
    onSuccess: (data) => setProductForm({ ...productForm, ...data }),
    onError: (err) => errorDispatcher(err as AxiosError<IBaseResponse>, refresh),
  });

  const productMutation = useMutation((productForm: ProductForm) => updateProduct(params.id as string, productForm, { accessToken }), {
    onSuccess: () => {
      setShowUpdateSuccessMessage(true);
      queryClient.invalidateQueries(['productsList']);
    },
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
    setShowUpdateSuccessMessage(false);
    setErrorMessage('');
  };

  return (
    <div className="flex flex-col w-full ">
      <h1 className="text-3xl font-bold mb-2 text-[#00000090]">Detalhes</h1>
      <hr />
      <Paper sx={{ paddingX: '2.5rem', paddingY: '1rem', marginTop: '1.5rem', minWidth: 400 }} elevation={2}>
        <form onSubmit={handleSubmit}>
          <Grid container>
            <Grid item xs={12} sm={6} textAlign="left">
              <Tooltip title="Voltar para listagem" placement="top" arrow>
                <ColoredIconButton size="medium" onClick={handleGoBack} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.06)' }}>
                  <ArrowBack fontSize="small" />
                </ColoredIconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} textAlign="right">
              <Tooltip title={`${edit ? 'Desabilitar' : 'Habilitar'} edição`} placement="top" arrow>
                <span>
                  <ColoredIconButton
                    disabled={isFetching}
                    size="medium"
                    onClick={() => setEdit((state) => !state)}
                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.06)' }}
                  >
                    {edit ? <Edit fontSize="small" /> : <EditOff fontSize="small" />}
                  </ColoredIconButton>
                </span>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={24} sm={12}>
              <Divider>
                <Chip icon={<Info />} sx={{ color: '#00000090' }} label="INFORMAÇÕES DO PRODUTO" />
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                variant={fieldVariant}
                sx={inputStyle}
                type="text"
                label="Nome"
                value={productForm.name}
                placeholder="Nome do produto"
                onChange={(e) => handleForm(e, 'name')}
                InputProps={{ readOnly: !edit }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                select
                variant={fieldVariant}
                sx={inputStyle}
                label="Unidade do produto"
                value={productForm?.unit || null}
                placeholder="Unidade do produto"
                onChange={(e) => handleForm(e, 'unit')}
                InputProps={{ readOnly: !edit }}
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
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRLocale}>
                <DatePicker
                  readOnly
                  loading={isFetching}
                  label="Produto criado em"
                  value={productForm?.createdAt || null}
                  onChange={() => {}}
                  renderInput={(params) => {
                    return <TextField sx={inputStyle} fullWidth variant="filled" {...params} />;
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRLocale}>
                <DatePicker
                  readOnly
                  loading={isFetching}
                  label="Última atualização em"
                  value={productForm?.updatedAt || null}
                  onChange={() => {}}
                  renderInput={(params) => {
                    return <TextField sx={inputStyle} fullWidth variant="filled" {...params} />;
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={24} sm={12}>
              <TextField
                fullWidth
                label="Menor preço encontrado"
                value={productForm.lowestPrice || ''}
                variant="filled"
                sx={inputStyle}
                placeholder="Nenhum preço encontrado"
                InputProps={{
                  readOnly: true,
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
                helperText={productForm.lowestPriceEstablishment && `Estabelecimento: ${productForm.lowestPriceEstablishment}`}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} paddingTop={2}>
            <Grid item xs={24} sm={12} textAlign="right">
              <LoadingButton
                endIcon={<Send />}
                loading={productMutation.isLoading}
                disabled={!edit}
                type="submit"
                variant="contained"
                style={btnStyle}
              >
                Salvar alterações
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Paper>
      {(isFetching || productMutation.isLoading) && <ColoredLinearProgress />}
      <SnackbarAlert
        backgroundColor="#367315"
        open={showUpdateSuccessMessage}
        text="Dados atualizados com sucesso"
        handleClose={handleMessageClose}
      />
      <SnackbarAlert backgroundColor="#B00020" open={!!errorMessage} text={errorMessage} handleClose={handleMessageClose} />
    </div>
  );
};

export default ProductDetails;
