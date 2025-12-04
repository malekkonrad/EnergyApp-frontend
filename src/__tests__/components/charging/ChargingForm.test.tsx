import { render, screen, fireEvent } from '@testing-library/react';
import { ChargingForm } from '@/components/charging/ChargingForm';

describe('ChargingForm', () => {
  it('should render with default value of 2 hours', () => {
    const onSubmit = jest.fn();
    render(<ChargingForm onSubmit={onSubmit} isLoading={false} />);

    const slider = screen.getByRole('slider');
    expect(slider).toHaveValue('2');
  });

  it('should update hours when slider changes', () => {
    const onSubmit = jest.fn();
    render(<ChargingForm onSubmit={onSubmit} isLoading={false} />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '4' } });

    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('should increase hours when + button is clicked', () => {
    const onSubmit = jest.fn();
    render(<ChargingForm onSubmit={onSubmit} isLoading={false} />);

    const plusButton = screen.getByText('+');
    fireEvent.click(plusButton);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should decrease hours when - button is clicked', () => {
    const onSubmit = jest.fn();
    render(<ChargingForm onSubmit={onSubmit} isLoading={false} />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '3' } });

    const minusButton = screen.getByText('−');
    fireEvent.click(minusButton);

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should not go below 1 hour', () => {
    const onSubmit = jest.fn();
    render(<ChargingForm onSubmit={onSubmit} isLoading={false} />);

    const minusButton = screen.getByText('−');
    fireEvent.click(minusButton); 

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should not go above 6 hours', () => {
    const onSubmit = jest.fn();
    render(<ChargingForm onSubmit={onSubmit} isLoading={false} />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '6' } });

    const plusButton = screen.getByText('+');
    fireEvent.click(plusButton); 

    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('should call onSubmit with correct hours when form is submitted', () => {
    const onSubmit = jest.fn();
    render(<ChargingForm onSubmit={onSubmit} isLoading={false} />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '4' } });

    const button = screen.getByRole('button', { name: /compute optimal/i });
    fireEvent.click(button);

    expect(onSubmit).toHaveBeenCalledWith(4);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});