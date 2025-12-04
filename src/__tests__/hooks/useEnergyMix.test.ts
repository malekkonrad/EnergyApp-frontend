import { renderHook, waitFor } from '@testing-library/react';
import { useEnergyMix } from '@/hooks/useEnergyMix';
import { energyService } from '@/api/energyService';

jest.mock('@/api/energyService');

describe('useEnergyMix', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start with loading state', () => {
    (energyService.getEnergyMix as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useEnergyMix());

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should fetch and return energy mix data', async () => {
    const mockData = [
      {
        date: '2024-12-04',
        sources: {
          wind: 30,
          solar: 20,
          hydro: 15,
        },
        cleanEnergyShare: 65,
      },
    ];

    (energyService.getEnergyMix as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useEnergyMix());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(energyService.getEnergyMix).toHaveBeenCalledTimes(1);
  });

  it('should handle errors', async () => {
    const mockError = new Error('API Error');
    (energyService.getEnergyMix as jest.Mock).mockRejectedValue(mockError);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useEnergyMix());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Failed to download energy mix.');
    
    expect(consoleErrorSpy).toHaveBeenCalledWith('getEnergyMix error:', mockError);

    consoleErrorSpy.mockRestore();
  });
});