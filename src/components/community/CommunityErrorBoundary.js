import React from 'react';
import ErrorScreen from '../common/ErrorScreen';

class CommunityErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Community component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorScreen 
          message="Something went wrong in the community section."
          error={this.state.error}
          onRetry={() => {
            this.setState({ hasError: false, error: null });
            // Attempt to reload the component
            if (this.props.onRetry) {
              this.props.onRetry();
            }
          }}
        />
      );
    }

    return this.props.children;
  }
}

export default CommunityErrorBoundary;
