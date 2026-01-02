import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component for catching and displaying React errors
 * 
 * Specifically useful for Shopify API failures and other runtime errors
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-lunelle-cream px-4">
          <div className="max-w-md rounded-lg bg-white p-8 shadow-soft text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-lunelle-pink" aria-hidden="true" />
            <h1 className="font-serif text-2xl font-semibold text-foreground mb-2">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mb-6">
              We're sorry, but something unexpected happened. Please try again.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground mb-2">
                  Error details (development only)
                </summary>
                <pre className="overflow-auto rounded bg-muted p-3 text-xs">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <Button onClick={this.handleReset} className="bg-lunelle-pink hover:bg-lunelle-pink/90">
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

