import { httpClient } from './httpClient';
import {
  EnergyMixDay,
  OptimalWindowRequest,
  OptimalWindowResponse,
  RawEnergyMixDay,
} from './types';

function mapRawEnergyMixDay(dto: RawEnergyMixDay): EnergyMixDay {
  return {
    date: dto.date,
    sources: dto.mix,
    cleanEnergyShare: dto.cleanPercentage,
  };
}

export const energyService = {
  async getEnergyMix(): Promise<EnergyMixDay[]> {
    const raw = await httpClient.get<RawEnergyMixDay[]>('/api/energy-mix');
    return raw.map(mapRawEnergyMixDay);
  },

  async getOptimalWindow(
      payload: OptimalWindowRequest,
  ): Promise<OptimalWindowResponse> {
    const params = new URLSearchParams({
      hours: String(payload.hours),
    });

    const response = await httpClient.get<OptimalWindowResponse>(
      `/api/charging-window?${params.toString()}`,
    );

    return response;
  },
};
