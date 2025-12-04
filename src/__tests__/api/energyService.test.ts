import { energyService } from '@/api/energyService';
import { httpClient } from '@/api/httpClient';
import { RawEnergyMixDay, EnergyMixDay, OptimalWindowResponse } from '@/api/types';

jest.mock('@/api/httpClient');

describe('energyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getEnergyMix', () => {
    it('should fetch and transform energy mix data', async () => {
      const mockRawData: RawEnergyMixDay[] = [
        {
          date: '2024-12-04',
          mix: {
            wind: 30.5,
            solar: 20.3,
            hydro: 15.2,
            biomass: 10.0,
            coal: 14.0,
            gas: 8.0,
            other: 2.0,
          },
          cleanPercentage: 76.0,
        },
        {
          date: '2024-12-05',
          mix: {
            wind: 25.0,
            solar: 18.0,
            hydro: 12.0,
            biomass: 8.0,
            coal: 20.0,
            gas: 12.0,
            other: 5.0,
          },
          cleanPercentage: 63.0,
        },
      ];

      const expectedData: EnergyMixDay[] = [
        {
          date: '2024-12-04',
          sources: {
            wind: 30.5,
            solar: 20.3,
            hydro: 15.2,
            biomass: 10.0,
            coal: 14.0,
            gas: 8.0,
            other: 2.0,
          },
          cleanEnergyShare: 76.0,
        },
        {
          date: '2024-12-05',
          sources: {
            wind: 25.0,
            solar: 18.0,
            hydro: 12.0,
            biomass: 8.0,
            coal: 20.0,
            gas: 12.0,
            other: 5.0,
          },
          cleanEnergyShare: 63.0,
        },
      ];

      (httpClient.get as jest.Mock).mockResolvedValueOnce(mockRawData);

      const result = await energyService.getEnergyMix();

      expect(httpClient.get).toHaveBeenCalledWith('/api/energy-mix');
      expect(httpClient.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedData);
    });

    it('should handle empty response', async () => {
      (httpClient.get as jest.Mock).mockResolvedValueOnce([]);

      const result = await energyService.getEnergyMix();

      expect(result).toEqual([]);
      expect(httpClient.get).toHaveBeenCalledWith('/api/energy-mix');
    });

    it('should propagate errors from httpClient', async () => {
      const error = new Error('Network error');
      (httpClient.get as jest.Mock).mockRejectedValueOnce(error);

      await expect(energyService.getEnergyMix()).rejects.toThrow('Network error');
    });

    it('should correctly map multiple days', async () => {
      const mockRawData: RawEnergyMixDay[] = [
        {
          date: '2024-12-04',
          mix: { wind: 50, solar: 50 },
          cleanPercentage: 100,
        },
        {
          date: '2024-12-05',
          mix: { coal: 100 },
          cleanPercentage: 0,
        },
        {
          date: '2024-12-06',
          mix: { wind: 30, coal: 70 },
          cleanPercentage: 30,
        },
      ];

      (httpClient.get as jest.Mock).mockResolvedValueOnce(mockRawData);

      const result = await energyService.getEnergyMix();

      expect(result).toHaveLength(3);
      expect(result[0].cleanEnergyShare).toBe(100);
      expect(result[1].cleanEnergyShare).toBe(0);
      expect(result[2].cleanEnergyShare).toBe(30);
    });
  });

  describe('getOptimalWindow', () => {
    it('should fetch optimal charging window with correct parameters', async () => {
      const mockResponse: OptimalWindowResponse = {
        startTime: '2024-12-04T14:00:00Z',
        endTime: '2024-12-04T18:00:00Z',
        cleanEnergyShare: 75.5,
      };

      (httpClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await energyService.getOptimalWindow({ hours: 4 });

      expect(httpClient.get).toHaveBeenCalledWith('/api/charging-window?hours=4');
      expect(httpClient.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    it('should handle different hour values', async () => {
      const testCases = [1, 2, 3, 4, 5, 6];

      for (const hours of testCases) {
        const mockResponse: OptimalWindowResponse = {
          startTime: '2024-12-04T10:00:00Z',
          endTime: `2024-12-04T${10 + hours}:00:00Z`,
          cleanEnergyShare: 80,
        };

        (httpClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

        const result = await energyService.getOptimalWindow({ hours });

        expect(httpClient.get).toHaveBeenCalledWith(
          `/api/charging-window?hours=${hours}`
        );
        expect(result).toEqual(mockResponse);

        jest.clearAllMocks();
      }
    });

    it('should handle API errors', async () => {
      const error = new Error('Server error');
      (httpClient.get as jest.Mock).mockRejectedValueOnce(error);

      await expect(
        energyService.getOptimalWindow({ hours: 4 })
      ).rejects.toThrow('Server error');
    });

    it('should return response without transformation', async () => {
      const mockResponse: OptimalWindowResponse = {
        startTime: '2024-12-04T12:00:00Z',
        endTime: '2024-12-04T15:00:00Z',
        cleanEnergyShare: 85.3,
      };

      (httpClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await energyService.getOptimalWindow({ hours: 3 });

      expect(result).toBe(mockResponse);
    });

    it('should properly encode URL parameters', async () => {
      const mockResponse: OptimalWindowResponse = {
        startTime: '2024-12-04T10:00:00Z',
        endTime: '2024-12-04T16:00:00Z',
        cleanEnergyShare: 70,
      };

      (httpClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      await energyService.getOptimalWindow({ hours: 6 });

      const calledUrl = (httpClient.get as jest.Mock).mock.calls[0][0];
      expect(calledUrl).toContain('hours=6');
      expect(calledUrl).toContain('?');
    });
  });

  describe('data transformation', () => {
    it('should correctly map field names from API to internal format', async () => {
      const rawData: RawEnergyMixDay[] = [
        {
          date: '2024-12-04',
          mix: { wind: 40, solar: 30, coal: 30 },
          cleanPercentage: 70,
        },
      ];

      (httpClient.get as jest.Mock).mockResolvedValueOnce(rawData);

      const result = await energyService.getEnergyMix();

      expect(result[0]).toHaveProperty('sources');
      expect(result[0]).toHaveProperty('cleanEnergyShare');
      expect(result[0]).not.toHaveProperty('mix');
      expect(result[0]).not.toHaveProperty('cleanPercentage');
    });

    it('should preserve all energy source data', async () => {
      const allSources = {
        wind: 15,
        solar: 10,
        hydro: 20,
        biomass: 5,
        coal: 30,
        gas: 15,
        nuclear: 3,
        other: 2,
      };

      const rawData: RawEnergyMixDay[] = [
        {
          date: '2024-12-04',
          mix: allSources,
          cleanPercentage: 50,
        },
      ];

      (httpClient.get as jest.Mock).mockResolvedValueOnce(rawData);

      const result = await energyService.getEnergyMix();

      expect(result[0].sources).toEqual(allSources);
    });
  });
});