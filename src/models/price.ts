import { Establishment } from './establishment';
import { Product } from './product';
import { User } from './user';

export const PriceType: { [x: string]: 'COMMON' | 'DEAL' } = {
  COMMON: 'COMMON',
  DEAL: 'DEAL',
};

export type PriceType = typeof PriceType[keyof typeof PriceType];

export type Price = {
  id: string;
  value: number;
  type: number;
  isProductWithNearExpirationDate: boolean;
  createdAt: Date | string;
  expiresAt: Date | null;
  user: User | null;
  product: Product | null;
  establishment: Establishment | null;
};
