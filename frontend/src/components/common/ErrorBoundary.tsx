import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <Container maxWidth="sm" sx={{ mt: 8 }}>
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h4" gutterBottom color="error">
                            Something went wrong
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            We apologize for the inconvenience. The application has encountered an unexpected error.
                        </Typography>
                        {this.state.error && (
                            <Box sx={{ mt: 2, mb: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1, textAlign: 'left' }}>
                                <Typography variant="caption" component="pre" sx={{ overflowX: 'auto' }}>
                                    {this.state.error.toString()}
                                </Typography>
                            </Box>
                        )}
                        <Button
                            variant="contained"
                            startIcon={<RefreshIcon />}
                            onClick={() => window.location.reload()}
                        >
                            Reload Application
                        </Button>
                    </Paper>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
