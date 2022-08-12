export const ProductUnitType: { [x: string]: 'G' | 'KG' | 'EA' | 'BOX' | 'DZ' } = {
  G: 'G',
  KG: 'KG',
  EA: 'EA',
  BOX: 'BOX',
  DZ: 'DZ',
};

export type ProductUnitType = typeof ProductUnitType[keyof typeof ProductUnitType];

export type Product = {
  id: string;
  name: string;
  unit: ProductUnitType;
  createdAt: Date;
  updatedAt?: Date;
  lowestPrice?: number | null;
  lowestPriceEstablishment?: string | null;
};
