export const ProductUnitType: { [x: string]: 'G' | 'KG' | 'EA' | 'BOX' | 'DZ' } = {
  G: 'G',
  KG: 'KG',
  EA: 'EA',
  BOX: 'BOX',
  DZ: 'DZ',
};

export type ProductUnitType = typeof ProductUnitType[keyof typeof ProductUnitType];

export const ProductUnitMap = [
  [ProductUnitType.G, '(G) Grama'],
  [ProductUnitType.KG, '(KG) Quilograma'],
  [ProductUnitType.EA, '(UN) Unidade'],
  [ProductUnitType.BOX, '(CX) Caixa'],
  [ProductUnitType.DZ, '(DZ) Dúzia'],
];

export type Product = {
  id: string;
  name: string;
  unit: ProductUnitType;
  createdAt: Date | string;
  updatedAt?: Date | string;
  lowestPrice?: number | null;
  lowestPriceEstablishment?: string | null;
};

export type ProductForm = {
  name: string;
  unit: ProductUnitType;
  createdAt: Date | string;
  updatedAt?: Date | string;
  lowestPrice?: number | null;
  lowestPriceEstablishment?: string | null;
};
