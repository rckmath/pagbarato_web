import ptBRLocale from 'date-fns/locale/pt-BR';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AxiosError } from 'axios';
import {
  Chip,
  Divider,
  Grid,
  Paper,
  TextField,
  Tooltip,
  MenuItem,
  SelectChangeEvent,
  InputAdornment,
  FormControlLabel,
  Switch,
  Autocomplete,
  Box,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, FunctionComponent, MouseEvent, SyntheticEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack, Edit, EditOff, Info, Send, Commit } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { useAuth } from '../../context/AuthProvider';
import SnackbarAlert from '../../components/SnackbarAlert';
import { getPriceById, updatePrice } from '../../services/price';
import { ColoredIconButton } from '../../components/Buttons/ColoredIconButton';
import { ColoredLinearProgress } from '../../components/ColoredLinearProgress';
import { errorDispatcher, IBaseResponse } from '../../services/api';
import { Price, PriceForm, PriceType, PriceTypeMap } from '../../models/price';
import { getEstablishments } from '../../services/establishment';
import { getUsers } from '../../services/user';
import { getProducts } from '../../services/product';
import { Product } from '../../models/product';
import { User } from '../../models/user';
import { Establishment } from '../../models/establishment';
import { btnStyle, inputStyle } from '../../components/commonStyles';

type TextFieldVariant = 'filled' | 'standard' | 'outlined' | undefined;

type Categorize = {
  firstLetter: string;
};

interface PriceDetailsProps {}

const PriceDetails: FunctionComponent<PriceDetailsProps> = () => {
  const [edit, setEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showUpdateSuccessMessage, setShowUpdateSuccessMessage] = useState(false);

  const [dropdownUsers, setDropdownUsers] = useState<(User & Categorize)[]>([]);
  const [selectedUser, setSelectedUser] = useState<(User & Categorize) | null>(null);

  const [dropdownProducts, setDropdownProducts] = useState<(Product & Categorize)[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | (Product & Categorize) | null>(null);

  const [dropdownEstablishments, setDropdownEstablishments] = useState<(Establishment & Categorize)[]>([]);
  const [selectedEstablishment, setSelectedEstablishment] = useState<(Establishment & Categorize) | null>(null);

  const [priceForm, setPriceForm] = useState<PriceForm>({
    userId: '',
    productId: '',
    establishmentId: '',
    value: 0,
    isProductWithNearExpirationDate: false,
    expiresAt: null,
    createdAt: '',
    type: 'COMMON',
    user: null,
    product: null,
    establishment: null,
  });

  const params = useParams();
  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const queryClient = useQueryClient();
  const fieldVariant: TextFieldVariant = edit ? 'outlined' : 'filled';
  const accessToken = user != undefined && user ? (user.accessToken as string) : sessionStorage.getItem('accessToken');

  const { isFetching } = useQuery<Price>(['price', params.id], () => getPriceById(params.id as string, { accessToken }), {
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setPriceForm({ ...priceForm, ...data });

      if (data.user) {
        const firstUserLetter = data.user.name && data.user.name[0].toUpperCase();
        const initialUser: User & Categorize = {
          ...data.user,
          firstLetter: /[0-9]/.test(firstUserLetter) ? '0-9' : firstUserLetter,
        };
        setSelectedUser({ ...initialUser });
      }

      if (data.establishment) {
        const firstEstablishmentLetter = data.establishment.name && data.establishment.name[0].toUpperCase();
        const initialEstablishment: Establishment & Categorize = {
          ...data.establishment,
          firstLetter: /[0-9]/.test(firstEstablishmentLetter) ? '0-9' : firstEstablishmentLetter,
        };
        setSelectedEstablishment({ ...initialEstablishment });
      }

      if (data.product) {
        const firstProductLetter = data.product.name && data.product.name[0].toUpperCase();
        const initialProduct: Product & Categorize = {
          ...data.product,
          firstLetter: /[0-9]/.test(firstProductLetter) ? '0-9' : firstProductLetter,
        };
        setSelectedProduct({ ...initialProduct });
      }
    },
    onError: (err) => errorDispatcher(err as AxiosError<IBaseResponse>, refresh),
  });

  useQuery<Establishment[]>(['establishmentsDropdown'], () => getEstablishments({ accessToken }), {
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      const options = getCategorizedOptions<Establishment>(data);
      setDropdownEstablishments([...options]);
    },
    onError: (err) => errorDispatcher(err as AxiosError<IBaseResponse>, refresh),
  });

  useQuery<User[]>(['usersDropdown'], () => getUsers({ accessToken }), {
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      const options = getCategorizedOptions<User>(data);
      setDropdownUsers([...options]);
    },
    onError: (err) => errorDispatcher(err as AxiosError<IBaseResponse>, refresh),
  });

  useQuery<Product[]>(['productsDropdown'], () => getProducts({ accessToken }), {
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      const options = getCategorizedOptions<Product>(data);
      setDropdownProducts([...options]);
    },
    onError: (err) => errorDispatcher(err as AxiosError<IBaseResponse>, refresh),
  });

  function getCategorizedOptions<T extends { name: string }>(data: T[]) {
    const options: (T & Categorize)[] = data.map((option) => {
      const firstLetter = option.name[0].toUpperCase();
      return {
        firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
        ...option,
      };
    });

    return options;
  }

  function isType<T extends { name: string }>(opt: string | T): opt is T {
    if ((opt as T).name) return true;
    return false;
  }

  const priceMutation = useMutation((priceForm: PriceForm) => updatePrice(params.id as string, priceForm, { accessToken }), {
    onSuccess: () => {
      setShowUpdateSuccessMessage(true);
      queryClient.invalidateQueries(['pricesList']);
    },
  });

  const handleGoBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/prices', { replace: true });
    }
  };

  const handleForm = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>, param: string) => {
    setPriceForm({
      ...priceForm,
      [param]: e.target.value,
    });
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault();

    try {
      await priceMutation.mutateAsync(priceForm);
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
        <Box component="form" autoComplete="off">
          <Grid container>
            <Grid item xs={12} sm={6} textAlign="left">
              <Tooltip title="Voltar" placement="top" arrow>
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
                <Chip icon={<Commit />} sx={{ color: '#00000090' }} label="RELACIONAMENTOS" />
              </Divider>
            </Grid>
            <Grid item xs={24} sm={12}>
              <FormControlLabel
                disabled={!edit}
                control={
                  <Switch
                    checked={priceForm?.isProductWithNearExpirationDate}
                    onChange={(e) => {
                      setPriceForm({
                        ...priceForm,
                        isProductWithNearExpirationDate: e.target.checked,
                      });
                    }}
                    sx={{
                      '.Mui-checked': {
                        color: '#EF8F01 !important',
                      },
                      '.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#EF8F01 !important',
                      },
                      '.Mui-disabled + .Mui-checked': {
                        color: '#EF8F0190 !important',
                      },
                      '.Mui-checked.Mui-disabled': {
                        color: '#EF8F0190 !important',
                      },
                    }}
                  />
                }
                label="Produto próximo do vencimento?"
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <Autocomplete
                fullWidth
                readOnly={!edit}
                options={dropdownProducts.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                groupBy={(option) => option.firstLetter}
                getOptionLabel={(option) => {
                  if (isType<Product & Categorize>(option)) return option.name;
                  return option;
                }}
                sx={inputStyle}
                isOptionEqualToValue={(option: Product & Categorize, value: Product & Categorize) => option.id === value.id}
                value={selectedProduct}
                onChange={(_event: any, newValue: string | (Product & Categorize) | null) => {
                  setSelectedProduct(newValue);

                  if (newValue && isType<Product & Categorize>(newValue)) {
                    setPriceForm({ ...priceForm, productId: newValue.id, productName: null });
                  } else {
                    setPriceForm({ ...priceForm, productId: null, productName: newValue });
                  }
                }}
                onInputChange={(e, newValue: string) => {
                  setPriceForm({ ...priceForm, productName: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Produto"
                    placeholder="Selecione o produto"
                    variant={fieldVariant}
                    required
                    inputProps={{
                      ...params.inputProps,
                      required: !selectedProduct,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <Autocomplete
                fullWidth
                readOnly={!edit}
                options={dropdownEstablishments.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                groupBy={(option) => option.firstLetter}
                getOptionLabel={(option) => option.name}
                sx={inputStyle}
                isOptionEqualToValue={(option: Establishment & Categorize, value: Establishment & Categorize) => option.id === value.id}
                value={selectedEstablishment}
                onChange={(_event: any, newValue: (Establishment & Categorize) | null) => {
                  setSelectedEstablishment(newValue);
                  setPriceForm({ ...priceForm, establishmentId: newValue?.id || '' });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Estabelecimento"
                    placeholder="Selecione o estabelecimento"
                    variant={fieldVariant}
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <Autocomplete
                fullWidth
                readOnly={!edit}
                options={dropdownUsers.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                groupBy={(option) => option.firstLetter}
                getOptionLabel={(option) => option.name}
                sx={inputStyle}
                isOptionEqualToValue={(option: User & Categorize, value: User & Categorize) => option.id === value.id}
                value={selectedUser}
                onChange={(_event: any, newValue: (User & Categorize) | null) => {
                  setSelectedUser(newValue);
                  setPriceForm({ ...priceForm, userId: newValue?.id || '' });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Usuário" placeholder="Selecione um usuário" variant={fieldVariant} required />
                )}
              />
            </Grid>
            <Grid item xs={24} sm={12}>
              <Divider>
                <Chip icon={<Info />} sx={{ color: '#00000090' }} label="INFORMAÇÕES DO PREÇO" />
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                variant={fieldVariant}
                sx={inputStyle}
                type="number"
                label="Valor"
                value={priceForm.value}
                placeholder="0,00"
                onChange={(e) => handleForm(e, 'value')}
                InputProps={{
                  readOnly: !edit,
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  inputMode: 'numeric',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                select
                variant={fieldVariant}
                sx={inputStyle}
                label="Tipo de preço"
                value={priceForm?.type || null}
                placeholder="Tipo de preço"
                onChange={(e) => handleForm(e, 'type')}
                InputProps={{ readOnly: !edit }}
              >
                {PriceTypeMap.map((priceType) => {
                  return (
                    <MenuItem key={priceType[0]} value={priceType[0]}>
                      {priceType[1]}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
            <Grid item xs={8} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRLocale}>
                <DatePicker
                  loading={isFetching}
                  label="Preço publicado em"
                  value={priceForm.createdAt || null}
                  onChange={() => {}}
                  readOnly
                  renderInput={(params) => {
                    return <TextField sx={inputStyle} fullWidth variant="filled" {...params} />;
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={8} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRLocale}>
                <DatePicker
                  loading={isFetching}
                  label="Última atualização em"
                  value={priceForm.updatedAt || null}
                  onChange={() => {}}
                  readOnly
                  renderInput={(params) => {
                    return <TextField sx={inputStyle} fullWidth variant="filled" {...params} />;
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={8} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRLocale}>
                <DatePicker
                  loading={isFetching}
                  label="Oferta expira em"
                  value={priceForm.expiresAt || null}
                  onChange={(newValue: any) => {
                    setPriceForm({
                      ...priceForm,
                      expiresAt: newValue,
                    });
                  }}
                  readOnly={priceForm.type === PriceType.COMMON}
                  renderInput={(params) => {
                    return (
                      <TextField
                        sx={inputStyle}
                        fullWidth
                        variant={priceForm.type === PriceType.DEAL ? fieldVariant : 'filled'}
                        helperText={edit && priceForm.type === PriceType.COMMON && 'Campo disponível apenas para preços do tipo oferta.'}
                        {...params}
                      />
                    );
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Grid container spacing={4} paddingTop={2}>
            <Grid item xs={24} sm={12} textAlign="right">
              <LoadingButton
                endIcon={<Send />}
                loading={priceMutation.isLoading}
                disabled={!edit}
                type="button"
                variant="contained"
                style={btnStyle}
                onClick={(e) => {
                  handleSubmit(e);
                }}
              >
                Salvar alterações
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      {(isFetching || priceMutation.isLoading) && <ColoredLinearProgress />}
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

export default PriceDetails;
