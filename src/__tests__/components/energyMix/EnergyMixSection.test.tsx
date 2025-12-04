import { render, screen } from '@testing-library/react';
import { EnergyMixSection } from '@/components/energyMix/EnergyMixSection';
import { useEnergyMix } from '@/hooks/useEnergyMix';

jest.mock('@/hooks/useEnergyMix');

describe('EnergyMixSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loader when loading', () => {
    (useEnergyMix as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(<EnergyMixSection />);

    const loader = document.querySelector('[class*="spinner"]');
    expect(loader).toBeInTheDocument();
  });

  it('should render error message when error occurs', () => {
    (useEnergyMix as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: 'Failed to load energy mix',
    });

    render(<EnergyMixSection />);

    expect(screen.getByText('Failed to load energy mix')).toBeInTheDocument();
  });

  it('should render null when no data and not loading', () => {
    (useEnergyMix as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });

    const { container } = render(<EnergyMixSection />);

    expect(container.firstChild).toBeNull();
  });

  it('should render energy mix data with multiple days', () => {
    const mockData = [
      {
        date: '2024-12-04',
        sources: {
          wind: 30,
          solar: 20,
          coal: 50,
        },
        cleanEnergyShare: 50,
      },
      {
        date: '2024-12-05',
        sources: {
          wind: 40,
          solar: 25,
          coal: 35,
        },
        cleanEnergyShare: 65,
      },
      {
        date: '2024-12-06',
        sources: {
          wind: 35,
          solar: 30,
          coal: 35,
        },
        cleanEnergyShare: 65,
      },
    ];

    (useEnergyMix as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(<EnergyMixSection />);

    expect(screen.getByText('Energy Mix Forecast in UK')).toBeInTheDocument();

    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Tomorrow')).toBeInTheDocument();
    expect(screen.getByText('The next day')).toBeInTheDocument();
  });

  it('should display clean energy percentages for all days', () => {
    const mockData = [
      {
        date: '2024-12-04',
        sources: { wind: 50, coal: 50 },
        cleanEnergyShare: 50.0,
      },
      {
        date: '2024-12-05',
        sources: { wind: 75, coal: 25 },
        cleanEnergyShare: 75.5,
      },
    ];

    (useEnergyMix as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(<EnergyMixSection />);

    expect(screen.getByText(/50.0%/)).toBeInTheDocument();
    expect(screen.getByText(/75.5%/)).toBeInTheDocument();
  });

  it('should render correct number of cards', () => {
    const mockData = [
      {
        date: '2024-12-04',
        sources: { wind: 100 },
        cleanEnergyShare: 100,
      },
      {
        date: '2024-12-05',
        sources: { wind: 100 },
        cleanEnergyShare: 100,
      },
      {
        date: '2024-12-06',
        sources: { wind: 100 },
        cleanEnergyShare: 100,
      },
    ];

    (useEnergyMix as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    const { container } = render(<EnergyMixSection />);

    const cards = container.querySelectorAll('[class*="chartContainer"]');
    expect(cards.length).toBe(mockData.length);
  });
});