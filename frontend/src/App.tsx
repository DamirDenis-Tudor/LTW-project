import React from 'react';
import { AuthProvider } from './features/auth/AuthContext';
import AppRoutes from './routes/routes';

function App(): React.ReactElement {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;
