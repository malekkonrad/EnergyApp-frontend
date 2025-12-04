import { render } from '@testing-library/react';
import { Loader } from '@/components/common/Loader';

describe('Loader', () => {
  it('should render loader component', () => {
    const { container } = render(<Loader />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should have container and spinner elements', () => {
    const { container } = render(<Loader />);

    const loaderContainer = container.querySelector('[class*="container"]');
    const spinner = container.querySelector('[class*="spinner"]');

    expect(loaderContainer).toBeInTheDocument();
    expect(spinner).toBeInTheDocument();
  });

  it('should render with correct structure', () => {
    const { container } = render(<Loader />);

    const outerDiv = container.firstChild;
    expect(outerDiv).toBeInTheDocument();
    expect(outerDiv?.firstChild).toBeInTheDocument();
  });
});