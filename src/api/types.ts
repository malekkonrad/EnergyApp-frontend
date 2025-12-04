// src/api/types.ts

export type EnergySource =
  | 'biomass'
  | 'nuclear'
  | 'hydro'
  | 'wind'
  | 'solar'
  | 'coal'
  | 'gas'
  | 'imports'
  | 'other';

// to, co używa UI
export interface EnergyMixDay {
  date: string;
  sources: Record<EnergySource, number>;
  cleanEnergyShare: number;
}

// to, co REALNIE zwraca backend
export interface RawEnergyMixDay {
  date: string;
  mix: Record<EnergySource, number>;
  cleanPercentage: number;
}

export interface OptimalWindowRequest {
  hours: number;
}

export interface OptimalWindowResponse {
  start: string;
  end: string;
  cleanEnergyShare: number;
}
