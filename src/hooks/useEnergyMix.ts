// src/hooks/useEnergyMix.ts
import { useEffect, useState } from 'react';
import { energyService } from '../api/energyService';
import { EnergyMixDay } from '../api/types';

export function useEnergyMix() {
  const [data, setData] = useState<EnergyMixDay[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const result = await energyService.getEnergyMix();
        if (!active) return;
        setData(result);
        setError(null);
      } catch (e) {
        console.error('getEnergyMix error:', e); // <-- dodane
        if (!active) return;
        setError('Nie udało się pobrać miksu energetycznego.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}
