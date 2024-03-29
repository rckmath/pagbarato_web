export const DayOfWeekType: { [x: string]: 'SUN' | 'MON' | 'TUES' | 'WED' | 'THURS' | 'FRI' | 'SAT' | 'HOLIDAYS' } = {
  SUN: 'SUN',
  MON: 'MON',
  TUES: 'TUES',
  WED: 'WED',
  THURS: 'THURS',
  FRI: 'FRI',
  SAT: 'SAT',
  HOLIDAYS: 'HOLIDAYS',
};

export type DayOfWeekType = typeof DayOfWeekType[keyof typeof DayOfWeekType];

export const DayOfWeekMap = [
  [DayOfWeekType.SUN, 'Domingo'],
  [DayOfWeekType.MON, 'Segunda-feira'],
  [DayOfWeekType.TUES, 'Terça-feira'],
  [DayOfWeekType.WED, 'Quarta-feira'],
  [DayOfWeekType.THURS, 'Quinta-feira'],
  [DayOfWeekType.FRI, 'Sexta-feira'],
  [DayOfWeekType.SAT, 'Sábado'],
  [DayOfWeekType.HOLIDAYS, 'Feriados'],
];

export const MAX_BUSINESSES_HOURS = 8;

export type BusinessHours = {
  id?: string;
  day: DayOfWeekType;
  openingAt: Date | string | null;
  closureAt: Date | string | null;
};

export type Establishment = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  businessesHours?: Array<BusinessHours>;
  createdAt: Date | string;
  updatedAt?: Date | string;
};

export type EstablishmentForm = {
  name: string;
  latitude: number;
  longitude: number;
  businessesHours: Array<BusinessHours>;
  createdAt: Date | string;
  updatedAt?: Date | string;
};
