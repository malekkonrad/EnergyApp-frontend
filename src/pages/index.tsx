import type { NextPage } from 'next';
import { PageContainer } from '../components/layout/PageContainer';
import { Navbar } from '../components/navbar/Navbar'
import { EnergyMixSection } from '../components/energyMix/EnergyMixSection';
import { ChargingSection } from '../components/charging/ChargingSection';
import styles from '../styles/Home.module.css';

const HomePage: NextPage = () => (
  <>
  <Navbar />
  <PageContainer>
      <section id="energy-mix" className={styles.section}>
        <EnergyMixSection />
      </section>
      
      <section id="ev-charging" className={styles.section}>
        <ChargingSection />
      </section>
    </PageContainer>

  </>
);

export default HomePage;
