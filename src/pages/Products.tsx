import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';

import { DataGrid, GridRowsProp, GridColDef, ptBR } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';

import ConfirmDialog from '../components/ConfirmDialog';
import SnackbarAlert from '../components/SnackbarAlert';
import DataGridOverlay from '../components/DataGrid/DataGridOverlay';
import DataGridToolbar from '../components/DataGrid/DataGridToolbar';
import DataGridLoading from '../components/DataGrid/DataGridLoading';
import { createdAtColumnType, deleteColumnType } from '../components/DataGrid/DataGridCustomColumn';

import { api, IBaseResponse, PaginatedResponseType, queryClient } from '../services/api';
import { ProductUnitType, ProductType } from '../services/product';
import { UserAuth } from '../context/AuthProvider';

interface ProductsProps {}

const Products: FunctionComponent<ProductsProps> = () => {
  const [uid, setUid] = useState('');
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [rows, setRows] = useState<GridRowsProp<ProductType>>([]);
  const [rowCountState, setRowCountState] = useState<number>(count);
  const [showSuccessDeleteMessage, setShowSuccessDeleteMessage] = useState(false);

  const { user } = UserAuth();
  const localToken = sessionStorage.getItem('accessToken');

  const fetchProducts = async (page: number, pageSize: number): Promise<PaginatedResponseType<ProductType>> => {
    const accessToken = user?.accessToken || localToken;
    const { data: response }: IBaseResponse = await api.get(`/product?page=${page + 1}&pageSize=${pageSize}&priceFiltering=false`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  const {
    isFetching,
    isError,
    refetch,
    data: productsList,
  } = useQuery<PaginatedResponseType<ProductType>>(['productsList', page, pageSize], async () => fetchProducts(page, pageSize), {
    keepPreviousData: true,
    staleTime: 1000 * 60, // 1 minute
  });

  const handleSuccessDeleteClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowSuccessDeleteMessage(false);
  };

  const handleDelete = async (confirm = false) => {
    const accessToken = user?.accessToken || localToken;

    setConfirmDelete(false);

    if (!confirm) return;

    await api.delete(`/product/${uid}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    queryClient.invalidateQueries(['productsList']);
    setShowSuccessDeleteMessage(true);
    refetch();
  };

  useEffect(() => {
    if (productsList) {
      setCount(productsList.count);
      setRows([...productsList.records]);
    }
  }, [productsList]);

  useEffect(() => {
    setRowCountState((prevRowCountState) => (count !== undefined ? count : prevRowCountState));
  }, [count, setRowCountState]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'UID', hide: true, flex: 1 },
    { field: 'name', headerName: 'Nome', minWidth: 100, flex: 1 },
    {
      field: 'unit',
      headerName: 'Unidade',
      minWidth: 72,
      maxWidth: 90,
      flex: 1,
      type: 'singleSelect',
      valueOptions: [ProductUnitType.G, ProductUnitType.KG, ProductUnitType.EA, ProductUnitType.BOX, ProductUnitType.DZ],
    },
    { field: 'createdAt', ...createdAtColumnType },
    {
      field: 'delete',
      ...deleteColumnType({
        action: (id) => {
          if (!id) return;
          setConfirmDelete(true);
          setUid(id);
        },
      }),
    },
  ];

  return (
    <div className="flex flex-col">
      <h1 className="text-4xl font-bold">Produtos</h1>
      <div className="mt-8 w-full h-[74vh]">
        <DataGrid
          rows={rows}
          columns={columns}
          disableSelectionOnClick
          pagination
          rowCount={rowCountState}
          paginationMode="server"
          page={page}
          pageSize={pageSize}
          rowsPerPageOptions={[10, 15, 20, 30]}
          loading={isFetching}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(pageSize) => setPageSize(pageSize)}
          initialState={{
            sorting: {
              sortModel: [{ field: 'createdAt', sort: 'desc' }],
            },
          }}
          sx={{
            minHeight: '44.5vh',
            maxHeight: '80vh',
            borderRadius: 2,
            '& .MuiCircularProgress-root': {
              color: '#ef8f01',
            },
            '& .MuiCheckbox-root.Mui-checked': {
              color: '#ef8f01',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#ef8f0130',
            },
          }}
          components={{
            Toolbar: DataGridToolbar,
            LoadingOverlay: DataGridLoading,
            NoRowsOverlay: () => <DataGridOverlay error={isError} />,
          }}
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
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
