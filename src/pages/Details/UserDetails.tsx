import { useQuery } from '@tanstack/react-query';
import { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { User } from '../../models/user';
import { getUserById } from '../../services/user';

interface UserDetailsProps {}

const UserDetails: FunctionComponent<UserDetailsProps> = () => {
  const { user } = useAuth();
  const params = useParams();
  const accessToken = user?.accessToken || sessionStorage.getItem('accessToken');

  const { isLoading, isFetching, isError, data } = useQuery<User>(['user', params.id], () => getUserById(params.id as string, { accessToken }), {
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-2">Detalhes</h1>
      <hr />
    </div>
  );
};

export default UserDetails;
