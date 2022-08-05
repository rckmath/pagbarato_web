import { FunctionComponent } from 'react';

interface UsersProps {}

const Users: FunctionComponent<UsersProps> = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold p-[60px]">Usuários</h1>
    </div>
  );
};

export default Users;
