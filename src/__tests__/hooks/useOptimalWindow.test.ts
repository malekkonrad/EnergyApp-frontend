import { renderHook, waitFor } from '@testing-library/react';
import { useOptimalWindow } from '@/hooks/useOptimalWindow';
import { energyService } from '@/api/energyService';

jest.mock('@/api/energyService');

describe('useOptimalWindow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start with initial state', () => {
    const { result } = renderHook(() => useOptimalWindow());

    expect(result.current.loading).toBe(false);
    expect(result.current.result).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should fetch optimal window data', async () => {
    const mockResponse = {
      startTime: '2024-12-04T14:00:00Z',
      endTime: '2024-12-04T18:00:00Z',
      cleanEnergyShare: 75.5,
    };

    (energyService.getOptimalWindow as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useOptimalWindow());

    result.current.calculate(4);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.result).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
    expect(energyService.getOptimalWindow).toHaveBeenCalledWith({ hours: 4 });
  });

  it('should handle errors', async () => {
    const mockError = new Error('API Error');
    (energyService.getOptimalWindow as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useOptimalWindow());

    result.current.calculate(4);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.result).toBeNull();
    expect(result.current.error).toBe('Failed to calculate optimal loading window.');
  });

  it('should handle different hour values', async () => {
    const mockResponse = {
      startTime: '2024-12-04T10:00:00Z',
      endTime: '2024-12-04T16:00:00Z',
      cleanEnergyShare: 80,
    };

    (energyService.getOptimalWindow as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useOptimalWindow());

    result.current.calculate(6);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(energyService.getOptimalWindow).toHaveBeenCalledWith({ hours: 6 });
    expect(result.current.result).toEqual(mockResponse);
  });

  it('should reset error when making new request', async () => {
    const mockResponse = {
      startTime: '2024-12-04T14:00:00Z',
      endTime: '2024-12-04T18:00:00Z',
      cleanEnergyShare: 75.5,
    };

    (energyService.getOptimalWindow as jest.Mock).mockRejectedValueOnce(new Error('Error'));
    
    const { result } = renderHook(() => useOptimalWindow());

    result.current.calculate(4);

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to calculate optimal loading window.');
    });

    (energyService.getOptimalWindow as jest.Mock).mockResolvedValueOnce(mockResponse);

    result.current.calculate(4);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.result).toEqual(mockResponse);
  });

  it('should clear previous result on error', async () => {
    const mockResponse = {
      startTime: '2024-12-04T14:00:00Z',
      endTime: '2024-12-04T18:00:00Z',
      cleanEnergyShare: 75.5,
    };

    (energyService.getOptimalWindow as jest.Mock).mockResolvedValueOnce(mockResponse);
    
    const { result } = renderHook(() => useOptimalWindow());

    result.current.calculate(4);

    await waitFor(() => {
      expect(result.current.result).toEqual(mockResponse);
    });

    (energyService.getOptimalWindow as jest.Mock).mockRejectedValueOnce(new Error('Error'));

    result.current.calculate(4);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.result).toBeNull();
    expect(result.current.error).toBe('Failed to calculate optimal loading window.');
  });
});