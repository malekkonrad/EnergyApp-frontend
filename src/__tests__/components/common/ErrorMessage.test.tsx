import { render, screen } from '@testing-library/react';
import { ErrorMessage } from '@/components/common/ErrorMessage';

describe('ErrorMessage', () => {
  it('should render error message', () => {
    render(<ErrorMessage message="Something went wrong" />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should render with error styling', () => {
    const { container } = render(<ErrorMessage message="Error occurred" />);

    const errorElement = container.firstChild;
    expect(errorElement).toBeInTheDocument();
  });
});