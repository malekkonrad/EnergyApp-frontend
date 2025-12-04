import React from 'react';
import { useEnergyMix } from '../../hooks/useEnergyMix';
import { DayPieChartCard } from './DayPieChartCard';
import { Loader } from '../common/Loader';
import { ErrorMessage } from '../common/ErrorMessage';
import styles from './EnergyMixSection.module.css';

export const EnergyMixSection: React.FC = () => {
  const { data, loading, error } = useEnergyMix();

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Energy Mix Forecast</h2>
      <div className={styles.grid}>
        {data.map((day, index) => (
          <DayPieChartCard 
            key={day.date} 
            day={day} 
            dayOffset={index}
          />
        ))}
      </div>
    </section>
  );
};