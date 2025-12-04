import { FormEvent, useState } from 'react';
import styles from './ChargingForm.module.css';

interface ChargingFormProps {
  onSubmit: (hours: number) => void;
}

export const ChargingForm = ({ onSubmit }: ChargingFormProps) => {
  const [hours, setHours] = useState<number>(2);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (hours < 1 || hours > 6) return;
    onSubmit(hours);
  };

  const handleDecrease = () => {
    setHours((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setHours((prev) => Math.min(6, prev + 1));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* SLIDER Z LICZBĄ */}
      <div className={styles.sliderContainer}>
        <div className={styles.displayContainer}>
          <label className={styles.label}>
            Charging Time
          </label>
          <div className={styles.valueDisplay}>
            <span className={styles.valueNumber}>{hours}</span>
            <span className={styles.valueUnit}>h</span>
          </div>
        </div>

        {/* PRZYCISKI */}
        <div className={styles.controls}>
          <button
            type="button"
            onClick={handleDecrease}
            disabled={hours <= 1}
            className={styles.buttonDecrease}
          >
            −
          </button>

          {/* RANGE SLIDER */}
          <input
            type="range"
            min={1}
            max={6}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className={styles.slider}
          />

          <button
            type="button"
            onClick={handleIncrease}
            disabled={hours >= 6}
            className={styles.buttonIncrease}
          >
            +
          </button>
        </div>
      </div>

      {/* PRZYCISK SUBMIT */}
      <button
        type="submit"
        className={styles.submitButton}
      >
         Compute optimal charging window
      </button>
    </form>
  );
};