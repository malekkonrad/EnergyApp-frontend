import { useState } from 'react';
import { energyService } from '../api/energyService';
import { OptimalWindowResponse } from '../api/types';

export function useOptimalWindow() {
  const [result, setResult] = useState<OptimalWindowResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async (hours: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await energyService.getOptimalWindow({ hours });
      console.log(res);
      setResult(res);
    } catch (e) {
      setError('Failed to calculate optimal loading window.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, calculate };
}
