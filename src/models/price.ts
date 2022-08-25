import { Establishment } from './establishment';
import { Product } from './product';
import { User } from './user';

export const PriceType: { [x: string]: 'COMMON' | 'DEAL' } = {
  COMMON: 'COMMON',
  DEAL: 'DEAL',
};

export type PriceType = typeof PriceType[keyof typeof PriceType];

export const PriceTypeMap = [
  [PriceType.COMMON, 'Comum'],
  [PriceType.DEAL, 'Oferta'],
];

export type Price = {
  id: string;
  value: number;
  type: PriceType;
  isProductWithNearExpirationDate: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;
  expiresAt: Date | string | null;
  user: User | null;
  product: Product | null;
  establishment: Establishment | null;
};

export type PriceForm = {
  type: PriceType;
  value: number;
  userId: string;
  productId: string | null;
  productName?: string| null;
  establishmentId: string;
  isProductWithNearExpirationDate: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;
  expiresAt: Date | string | null;
  user: User | null;
  product: Product | null;
  establishment: Establishment | null;
};
