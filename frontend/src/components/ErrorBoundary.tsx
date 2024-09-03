import React, { Component, ErrorInfo, ReactNode } from 'react';

/**
 * Props for the ErrorBoundary component.
 */
interface ErrorBoundaryProps {
  children: ReactNode;
}

/**
 * State for the ErrorBoundary component.
 */
interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * ErrorBoundary component catches JavaScript errors in its child components.
 * It logs the errors and displays a fallback UI when an error occurs.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Lifecycle method that is called when an error occurs.
   * @param error The error that was thrown.
   * @param errorInfo Information about the error.
   */
  static getDerivedStateFromError(): ErrorBoundaryState {
    // Update state to indicate an error has occurred
    return { hasError: true };
  }

  /**
   * Lifecycle method that is called when an error occurs.
   * This method logs the error and error info to an external service or console.
   * @param error The error that was thrown.
   * @param errorInfo Information about the error.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to an external service or console
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    // Optionally: send error to an external logging service
  }

  /**
   * Renders the fallback UI when an error occurs.
   * @returns The fallback UI.
   */
  render(): ReactNode {
    if (this.state.hasError) {
      // Customize the fallback UI based on your needs
      return (
        <div role="alert">
          <h1>Something went wrong.</h1>
          <p>We're sorry, but something went wrong. Please try again later.</p>
        </div>
      );
    }

    // Render children when no error occurs
    return this.props.children;
  }
}
