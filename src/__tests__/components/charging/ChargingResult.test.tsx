import { render, screen } from '@testing-library/react';
import { ChargingResult } from '@/components/charging/ChargingResult';

describe('ChargingResult', () => {
  const mockResult = {
    start: '2024-12-04T14:00:00Z',
    end: '2024-12-04T18:00:00Z',
    cleanEnergyShare: 75.5,
  };

  it('should render charging result with all data', () => {
    render(<ChargingResult result={mockResult} />);

    expect(screen.getByText(/start/i)).toBeInTheDocument();
    expect(screen.getByText(/end/i)).toBeInTheDocument();
    expect(screen.getByText(/75.5/)).toBeInTheDocument();
  });

  

  it('should format dates correctly', () => {
    render(<ChargingResult result={mockResult} />);

    expect(screen.getByText(/4 Dec, 14:00/i)).toBeInTheDocument();
    expect(screen.getByText(/4 Dec, 14:00/i)).toBeInTheDocument();
  });
});