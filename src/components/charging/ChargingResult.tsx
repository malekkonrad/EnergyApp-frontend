import type { OptimalWindowResponse } from '../../api/types';
import styles from './ChargingResult.module.css';

interface ChargingResultProps {
  result: OptimalWindowResponse;
}

export const ChargingResult = ({ result }: ChargingResultProps) => {
  const formatTime = (date: string) => {
    return new Date(date).toLocaleString('en-GB', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC' 
    });
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Optimal chargin window</h3>

      <div className={styles.card}>
        <div className={styles.row}>
          <span className={styles.label}>Start</span>
          <span className={styles.value}>{formatTime(result.start)}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>End</span>
          <span className={styles.value}>{formatTime(result.end)}</span>
        </div>

        <div className={styles.highlight}>
          <span className={styles.highlightLabel}>Clean energy share</span>
          <span className={styles.highlightValue}>
            {result.cleanEnergyShare.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};