import React from 'react';
import { Box, Typography, Container } from '@mui/material';

function App(): React.ReactElement {
    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                }}
            >
                <Typography variant="h3" component="h1" gutterBottom>
                    EU Project Management System
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Frontend architecture setup complete. Phase 2 implementation coming next.
                </Typography>
            </Box>
        </Container>
    );
}

export default App;
