import React from 'react';
import { AuthProvider } from './features/auth/AuthContext';
import AppRoutes from './routes/routes';

import { SnackbarProvider, useSnackbar } from 'notistack';
import ErrorBoundary from './components/common/ErrorBoundary';
import { NotificationService } from './utils/notificationService';
import { useEffect } from 'react';

// Component to initialize the global notification service
const NotificationInitializer = () => {
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        NotificationService.setRef({ enqueueSnackbar });
    }, [enqueueSnackbar]);
    return null;
};

function App(): React.ReactElement {
    return (
        <ErrorBoundary>
            <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <NotificationInitializer />
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </SnackbarProvider>
        </ErrorBoundary>
    );
}

export default App;
