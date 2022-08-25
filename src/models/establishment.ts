export type Establishment = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  createdAt: Date | string;
  updatedAt?: Date | string;
};

export type EstablishmentForm = {
  name: string;
  latitude: number;
  longitude: number;
  createdAt: Date | string;
  updatedAt?: Date | string;
};
