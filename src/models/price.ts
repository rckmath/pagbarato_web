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
};
