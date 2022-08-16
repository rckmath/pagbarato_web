export const UserRoleType: { [x: string]: 'CONSUMER' | 'ADMIN' } = {
  CONSUMER: 'CONSUMER',
  ADMIN: 'ADMIN',
};

export type UserRoleType = typeof UserRoleType[keyof typeof UserRoleType];

export type User = {
  id: string;
  name: string;
  email: string;
  birthDate: Date | null;
  role: UserRoleType;
  createdAt: Date | string;
};

export type UserForm = {
  name: string;
  email: string;
  role?: UserRoleType;
  birthDate: Date | null;
  password?: string;
  confirmPassword?: string;
};
