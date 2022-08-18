export const UserRoleType: { [x: string]: 'CONSUMER' | 'ADMIN' } = {
  CONSUMER: 'CONSUMER',
  ADMIN: 'ADMIN',
};

export type UserRoleType = typeof UserRoleType[keyof typeof UserRoleType];

export const UserRoleMap = {
  [UserRoleType.ADMIN]: 'Administrador',
  [UserRoleType.CONSUMER]: 'Consumidor',
};

export type User = {
  id: string;
  name: string;
  email: string;
  birthDate: Date | null;
  role: UserRoleType;
  createdAt: Date | string;
  updatedAt?: Date | string;
};

export type UserForm = {
  name: string;
  email: string;
  role?: UserRoleType;
  birthDate: Date | null;
  password?: string;
  confirmPassword?: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
};
