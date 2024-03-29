import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';

import { DataGrid, GridColumns, GridRowsProp } from '@mui/x-data-grid';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import ConfirmDialog from '../../components/ConfirmDialog';
import SnackbarAlert from '../../components/SnackbarAlert';
import { dataGridBasePropsDefinitions } from '../../components/DataGrid/DataGridBaseConfig';
import { actionsColumnMenu, dateAndTimeColumnType } from '../../components/DataGrid/DataGridCustomColumns';

import { getProductsPaginated } from '../../services/product';
import { api, errorDispatcher, IBaseResponse, PaginatedResponseType } from '../../services/api';
import { ProductUnitType, Product, ProductUnitMap } from '../../models/product';

import { useAuth } from '../../context/AuthProvider';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { PostAdd } from '@mui/icons-material';
import { newEntryBtnStyle } from '../../components/CommonStyles';

interface ProductsProps {}

const Products: FunctionComponent<ProductsProps> = () => {
  const [uid, setUid] = useState('');
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [rowCountState, setRowCountState] = useState<number>(0);
  const [rowsState, setRowsState] = useState<GridRowsProp<Product>>([]);
  const [showSuccessDeleteMessage, setShowSuccessDeleteMessage] = useState(false);

  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const queryClient = useQueryClient();
  const accessToken = user != undefined && user ? (user.accessToken as string) : sessionStorage.getItem('accessToken');

  const { isLoading, isFetching, isError, data } = useQuery<PaginatedResponseType<Product>>(
    ['productsList', page, pageSize],
    async () => getProductsPaginated(page, pageSize, { accessToken }),
    {
      enabled: !!accessToken,
      keepPreviousData: true,
      staleTime: 2000 * 60,
      onError: (err) => errorDispatcher(err as AxiosError<IBaseResponse>, refresh),
    },
  );

  const handleNewEntry = () => {
    navigate('/products/new');
  };

  const handleSuccessDeleteClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowSuccessDeleteMessage(false);
  };

  const handleDelete = async (confirm = false) => {
    setConfirmDelete(false);
    if (!confirm) return;
    await api.delete('/product/' + uid, { headers: { Authorization: `Bearer ${accessToken}` } });
    queryClient.invalidateQueries(['productsList']);
    setShowSuccessDeleteMessage(true);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(true);
    setUid(id);
  };

  const handleDetailsClick = (id: string) => {
    setUid(id);
    navigate(`/products/${id}`);
  };

  useEffect(() => {
    setRowsState((prevRowsState) => (data?.records !== undefined ? data.records : prevRowsState));
  }, [data?.records, setRowsState]);

  useEffect(() => {
    setRowCountState((prevRowCountState) => (data?.count !== undefined ? data.count : prevRowCountState));
  }, [data?.count, setRowCountState]);

  const columns: GridColumns<Product> = [
    { field: 'id', headerName: 'UID', hide: true, flex: 1 },
    { field: 'name', headerName: 'Nome', minWidth: 200, flex: 1 },
    {
      field: 'unit',
      headerName: 'Unidade',
      minWidth: 135,
      maxWidth: 135,
      flex: 1,
      type: 'singleSelect',
      valueOptions: [ProductUnitType.G, ProductUnitType.KG, ProductUnitType.EA, ProductUnitType.BOX, ProductUnitType.DZ],
      valueFormatter: (params) => {
        const unit = ProductUnitMap.find((x) => x && x[0] === params.value);
        if (unit) return unit[1];
        return '(UN) Unidade';
      },
    },
    { field: 'createdAt', headerName: 'Data de criação', ...dateAndTimeColumnType },
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params) => actionsColumnMenu({ params, deleteAction: handleDeleteClick, detailsAction: handleDetailsClick }),
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex flex-col flex-1">
        <h1 className="text-3xl font-semibold mb-2 text-[#0A0A0A]">Produtos</h1>
        <div className="h-1 w-10 mr-2 bg-main-orange"></div>
      </div>
      <div className="w-full h-[74vh]">
        <div className="flex justify-end w-full">
          <Button size="small" variant="contained" startIcon={<PostAdd />} sx={newEntryBtnStyle} onClick={handleNewEntry}>
            Nova entrada
          </Button>
        </div>
        <DataGrid
          {...dataGridBasePropsDefinitions({ isError })}
          rows={rowsState}
          columns={columns}
          rowCount={rowCountState}
          page={page}
          pageSize={pageSize}
          loading={isLoading || isFetching}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(pageSize) => setPageSize(pageSize)}
        />
      </div>
      <ConfirmDialog
        title="Confirmar ação"
        content={`Deseja mesmo apagar o produto selecionado?`}
        openDialog={confirmDelete}
        confirmAction={handleDelete}
      />
      <SnackbarAlert
        backgroundColor="#012900"
        open={showSuccessDeleteMessage}
        text="Produto excluído com sucesso!"
        handleClose={handleSuccessDeleteClose}
      />
    </div>
  );
};

export default Products;
