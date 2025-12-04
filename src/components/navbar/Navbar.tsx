import React from 'react';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.icon}>⚡</span>
          <span className={styles.title}>EnergyApp</span>
        </div>
        
        <div className={styles.links}>
          <a href="#energy-mix" className={styles.link}>
            Energy Mix
          </a>
          <a href="#ev-charging" className={styles.link}>
            EV Charging
          </a>
        </div>
      </div>
    </nav>
  );
};