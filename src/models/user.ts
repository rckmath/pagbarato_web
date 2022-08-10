export const UserRoleType: { [x: string]: 'CONSUMER' | 'ADMIN' } = {
  CONSUMER: 'CONSUMER',
  ADMIN: 'ADMIN',
};

export type UserRoleType = typeof UserRoleType[keyof typeof UserRoleType];

export type UserType = {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
  isAdmin: boolean;
  createdAt: Date | string;
};
