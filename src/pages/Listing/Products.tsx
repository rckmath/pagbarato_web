import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';

import { DataGrid, GridColumns, GridRowsProp } from '@mui/x-data-grid';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import ConfirmDialog from '../../components/ConfirmDialog';
import SnackbarAlert from '../../components/SnackbarAlert';
import { dataGridBasePropsDefinitions } from '../../components/DataGrid/DataGridBaseConfig';
import { actionsColumnMenu, dateAndTimeColumnType } from '../../components/DataGrid/DataGridCustomColumns';

import { getProducts } from '../../services/product';
import { api, errorDispatcher, IBaseResponse, PaginatedResponseType } from '../../services/api';
import { ProductUnitType, Product } from '../../models/product';

import { useAuth } from '../../context/AuthProvider';
import { AxiosError } from 'axios';

interface ProductsProps {}

const Products: FunctionComponent<ProductsProps> = () => {
  const [uid, setUid] = useState('');
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [rowCountState, setRowCountState] = useState<number>(0);
  const [rowsState, setRowsState] = useState<GridRowsProp<Product>>([]);
  const [showSuccessDeleteMessage, setShowSuccessDeleteMessage] = useState(false);

  const { user, refresh } = useAuth();
  const queryClient = useQueryClient();
  const accessToken = user != undefined && user ? (user.accessToken as string) : sessionStorage.getItem('accessToken');

  const { isLoading, isFetching, isError, data } = useQuery<PaginatedResponseType<Product>>(
    ['productsList', page, pageSize],
    async () => getProducts(page, pageSize, { accessToken }),
    {
      enabled: !!accessToken,
      keepPreviousData: true,
      staleTime: 2000 * 60,
      onError: (err) => errorDispatcher(err as AxiosError<IBaseResponse>, refresh),
    },
  );

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
      minWidth: 72,
      maxWidth: 90,
      flex: 1,
      type: 'singleSelect',
      valueOptions: [ProductUnitType.G, ProductUnitType.KG, ProductUnitType.EA, ProductUnitType.BOX, ProductUnitType.DZ],
    },
    { field: 'createdAt', headerName: 'Data de criação', ...dateAndTimeColumnType },
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params) => actionsColumnMenu({ params, deleteAction: handleDeleteClick }),
    },
  ];

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-2 text-[#00000090]">Produtos</h1>
      <hr />
      <div className="mt-6 w-full h-[74vh]">
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
        backgroundColor="#367315"
        open={showSuccessDeleteMessage}
        text="Produto excluído com sucesso!"
        handleClose={handleSuccessDeleteClose}
      />
    </div>
  );
};

export default Products;
