import { render, screen } from '@testing-library/react';
import { DayPieChartCard } from '@/components/energyMix/DayPieChartCard';
import { EnergyMixDay } from '@/api/types';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  PieChart: ({ children }: any) => <div>{children}</div>,
  Pie: ({ data }: any) => <div data-testid="pie-chart">{data.length} sources</div>,
  Cell: () => null,
}));

describe('DayPieChartCard', () => {
  const mockDay: EnergyMixDay = {
    date: '2024-12-04',
    sources: {
      wind: 30.5,
      solar: 20.3,
      coal: 25.0,
      gas: 15.2,
      hydro: 9.0,
    },
    cleanEnergyShare: 59.8,
  };

  it('should render day label for today (offset 0)', () => {
    render(<DayPieChartCard day={mockDay} dayOffset={0} />);

    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('should render day label for tomorrow (offset 1)', () => {
    render(<DayPieChartCard day={mockDay} dayOffset={1} />);

    expect(screen.getByText('Tomorrow')).toBeInTheDocument();
  });

  it('should render day label for the next day (offset 2)', () => {
    render(<DayPieChartCard day={mockDay} dayOffset={2} />);

    expect(screen.getByText('The next day')).toBeInTheDocument();
  });

  it('should render day label for future days (offset > 2)', () => {
    render(<DayPieChartCard day={mockDay} dayOffset={5} />);

    expect(screen.getByText('In 5 days')).toBeInTheDocument();
  });

  it('should format and display date', () => {
    render(<DayPieChartCard day={mockDay} dayOffset={0} />);

    expect(screen.getByText(/December/i)).toBeInTheDocument();
    expect(screen.getByText(/2024/i)).toBeInTheDocument();
  });

  it('should display clean energy percentage', () => {
    render(<DayPieChartCard day={mockDay} dayOffset={0} />);

    expect(screen.getByText(/Clean energy: 59.8%/i)).toBeInTheDocument();
  });

  it('should format clean energy share to 1 decimal place', () => {
    const dayWithManyDecimals: EnergyMixDay = {
      date: '2024-12-04',
      sources: { wind: 100 },
      cleanEnergyShare: 75.123456,
    };

    render(<DayPieChartCard day={dayWithManyDecimals} dayOffset={0} />);

    expect(screen.getByText(/75.1%/)).toBeInTheDocument();
  });

  it('should render badge with clean energy share', () => {
    const { container } = render(<DayPieChartCard day={mockDay} dayOffset={0} />);

    const badge = container.querySelector('[class*="badge"]');
    expect(badge).toBeInTheDocument();
  });

  it('should filter out energy sources with 0 value', () => {
    const dayWithZeros: EnergyMixDay = {
      date: '2024-12-04',
      sources: {
        wind: 50,
        solar: 50,
        coal: 0,
        gas: 0,
        biomass: 0,
      },
      cleanEnergyShare: 100,
    };

    render(<DayPieChartCard day={dayWithZeros} dayOffset={0} />);

    expect(screen.getByText('2 sources')).toBeInTheDocument();
  });

  it('should handle all energy sources', () => {
    const dayWithAllSources: EnergyMixDay = {
      date: '2024-12-04',
      sources: {
        biomass: 5,
        coal: 10,
        gas: 15,
        imports: 5,
        nuclear: 20,
        solar: 15,
        wind: 20,
        hydro: 8,
        other: 2,
      },
      cleanEnergyShare: 68,
    };

    render(<DayPieChartCard day={dayWithAllSources} dayOffset={0} />);

    expect(screen.getByText('9 sources')).toBeInTheDocument();
  });

  it('should use default dayOffset of 0 when not provided', () => {
    render(<DayPieChartCard day={mockDay} />);

    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('should display formatted date in correct locale', () => {
    const specificDay: EnergyMixDay = {
      date: '2024-12-25',
      sources: { wind: 100 },
      cleanEnergyShare: 100,
    };

    render(<DayPieChartCard day={specificDay} dayOffset={0} />);

    expect(screen.getByText(/December 25, 2024/i)).toBeInTheDocument();
  });
});