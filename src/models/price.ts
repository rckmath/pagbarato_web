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

export const TrustingType: { [x: string]: 'VERY_LOW' | 'LOW' | 'NEUTRAL' | 'HIGH' | 'VERY_HIGH' } = {
  VERY_LOW: 'VERY_LOW',
  LOW: 'LOW',
  NEUTRAL: 'NEUTRAL',
  HIGH: 'HIGH',
  VERY_HIGH: 'VERY_HIGH',
};

export type TrustingType = typeof TrustingType[keyof typeof TrustingType];

export const TrustingTypeMap = {
  [TrustingType.VERY_LOW]: { value: 'Muito baixa', color: '#B00020' },
  [TrustingType.LOW]: { value: 'Baixa', color: '#ef8f01' },
  [TrustingType.NEUTRAL]: { value: 'Neutra', color: '#aaa' },
  [TrustingType.HIGH]: { value: 'Alta', color: '#a2ae17' },
  [TrustingType.VERY_HIGH]: { value: 'Muito alta', color: '#367315' },
};

export type Price = {
  id: string;
  value: number;
  type: PriceType;
  isProductWithNearExpirationDate: boolean;
  thumbsUp: number;
  thumbsDown: number;
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
  productName?: string | null;
  establishmentId: string;
  isProductWithNearExpirationDate: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;
  expiresAt: Date | string | null;
  user: User | null;
  product: Product | null;
  establishment: Establishment | null;
};
