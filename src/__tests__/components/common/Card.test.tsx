import { render, screen } from '@testing-library/react';
import { Card } from '@/components/common/Card';

describe('Card', () => {
  it('should render children', () => {
    render(
      <Card>
        <div>Test content</div>
      </Card>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should apply custom className if provided', () => {
    const { container } = render(
      <Card className="custom-class">
        <div>Content</div>
      </Card>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should render multiple children', () => {
    render(
      <Card>
        <h1>Title</h1>
        <p>Description</p>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});