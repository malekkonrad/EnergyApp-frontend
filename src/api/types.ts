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

// for UI
export interface EnergyMixDay {
  date: string;
  sources: Record<EnergySource, number>;
  cleanEnergyShare: number;
}

// from backend
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
