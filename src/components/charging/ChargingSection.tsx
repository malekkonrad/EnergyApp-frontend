import { ChargingForm } from './ChargingForm';
import { ChargingResult } from './ChargingResult';
import { Card } from '../common/Card';
import { useOptimalWindow } from '../../hooks/useOptimalWindow';
import styles from './ChargingSection.module.css';


export const ChargingSection: React.FC = () => {
  const { result, loading, error, calculate } = useOptimalWindow();

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Optimal Charging Window</h2>
      <Card>
        <ChargingForm onSubmit={calculate} />
        {error && <p className={styles.error}>{error}</p>}
        {result && <ChargingResult result={result} />}
      </Card>
    </section>
  );
};