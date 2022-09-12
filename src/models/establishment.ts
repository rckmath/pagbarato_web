export const DaysOfWeekType: { [x: string]: 'SUN' | 'MON' | 'TUES' | 'WED' | 'THURS' | 'FRI' | 'SAT' | 'HOLIDAYS' } = {
  SUN: 'SUN',
  MON: 'MON',
  TUES: 'TUES',
  WED: 'WED',
  THURS: 'THURS',
  FRI: 'FRI',
  SAT: 'SAT',
  HOLIDAYS: 'HOLIDAYS',
};

export type DaysOfWeekType = typeof DaysOfWeekType[keyof typeof DaysOfWeekType];

export const DaysOfWeekTypeMap = [
  [DaysOfWeekType.SUN, 'Domingo'],
  [DaysOfWeekType.MON, 'Segunda'],
  [DaysOfWeekType.TUES, 'Terça'],
  [DaysOfWeekType.WED, 'Quarta'],
  [DaysOfWeekType.THURS, 'Quinta'],
  [DaysOfWeekType.FRI, 'Sexta'],
  [DaysOfWeekType.SAT, 'Sábado'],
  [DaysOfWeekType.HOLIDAYS, 'Feriados'],
];

export const MAX_BUSINESSES_HOURS = 8;

export type BusinessHours = {
  id?: string;
  day: DaysOfWeekType;
  openingAt: Date | string | null;
  closureAt: Date | string | null;
};

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
  businessHours: Array<BusinessHours>;
  createdAt: Date | string;
  updatedAt?: Date | string;
};
