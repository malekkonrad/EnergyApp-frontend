import React from 'react';
import type { EnergyMixDay, EnergySource } from '../../api/types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import styles from './DayPieChartCard.module.css';


// Kolejność źródeł energii
export const ENERGY_SOURCES_ORDER: EnergySource[] = [
  'biomass',
  'coal',
  'gas',
  'imports',
  'nuclear',
  'solar',
  'wind',
  'hydro',
  'other',
];

// Kolory dla każdego źródła
export const ENERGY_COLORS: Record<EnergySource, string> = {
  biomass: '#7c4a10',  // brązowy (biomasa)
  coal: '#000000',     // czarny (węgiel)
  gas: '#103fb5',      // niebieski (gaz)
  imports: '#2e8d16',  // zielony (import)
  nuclear: '#ff0000',  // czerwony (atom)
  solar: '#fbbf24',    // żółty (słońce)
  wind: '#0ea5e9',     // błękitny (wiatr)
  hydro: '#00126b',    // ciemnoniebieski (woda)
  other: '#6b7280',    // szary (inne)
};

// Nazwy źródeł energii
const ENERGY_LABELS: Record<EnergySource, string> = {
  biomass: 'Biomass',
  coal: 'Coal',
  gas: 'Gas',
  imports: 'Imports',
  nuclear: 'Nuclear',
  solar: 'Solar',
  wind: 'Wind',
  hydro: 'Hydro',
  other: 'Other',
};

interface DayPieChartCardProps {
  day: EnergyMixDay;
  dayOffset?: number;
}

const getDayLabel = (offset: number): string => {
  switch (offset) {
    case 0:
      return 'Today';
    case 1:
      return 'Tomorrow';
    case 2:
      return 'The next day';
    default:
      return `In ${offset} days`;
  }
};

const RADIAN = Math.PI / 180;

// Etykieta: Nazwa + procent, na zewnątrz koła
const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, percent, name } = props;

  if (!percent || percent < 0.001) return null; // pomijamy bardzo małe kawałki

  const radius = outerRadius + 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const valuePercent = (percent * 100).toFixed(1);

  return (
    <text
      x={x}
      y={y}
      fill="#0f172a"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-[10px]"
    >
      {`${name} ${valuePercent}%`}
    </text>
  );
};

// Kolorowe linie do etykiet
const renderLabelLine = (props: any) => {
  const { cx, cy, midAngle, outerRadius, payload } = props;
  const color = payload?.color ?? '#0f172a';

  const sx = cx + outerRadius * Math.cos(-midAngle * RADIAN);
  const sy = cy + outerRadius * Math.sin(-midAngle * RADIAN);

  const mx = cx + (outerRadius + 8) * Math.cos(-midAngle * RADIAN);
  const my = cy + (outerRadius + 8) * Math.sin(-midAngle * RADIAN);

  const ex = mx + (mx > cx ? 10 : -10);
  const ey = my;

  return (
    <polyline
      points={`${sx},${sy} ${mx},${my} ${ex},${ey}`}
      stroke={color}
      strokeWidth={1}
      fill="none"
    />
  );
};

export const DayPieChartCard: React.FC<DayPieChartCardProps> = ({ 
  day, 
  dayOffset = 0 
}) => {
  // Konwersja danych do formatu Recharts
  const chartData = ENERGY_SOURCES_ORDER.map((source) => ({
    key: source,
    name: ENERGY_LABELS[source],
    value: day.sources[source] ?? 0,
    color: ENERGY_COLORS[source],
  })).filter(d => d.value > 0); // opcjonalnie: wywal zera

  // Formatowanie daty (Twój format: "December 3, 2025")
  const formattedDate = new Date(day.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  
  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        
        {/* Nagłówek - dzień i data */}
        <div className={styles.header}>
          <h3 className={styles.title}>
            {getDayLabel(dayOffset)}
          </h3>
          <p className={styles.date}>
            {formattedDate}
          </p>
        </div>

        {/* Badge z % czystej energii */}
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span>
            Clean energy: {day.cleanEnergyShare.toFixed(1)}%
          </span>
        </div>

        {/* Wykres kołowy */}
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={0}
                paddingAngle={0}
                strokeWidth={3}
                stroke="#ffffff"
                label={renderCustomizedLabel}
                labelLine={renderLabelLine}
              >
                {chartData.map((entry) => (
                  <Cell 
                    key={entry.key} 
                    fill={entry.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
