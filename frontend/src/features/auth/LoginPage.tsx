import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    CircularProgress,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { useAuth } from './AuthContext';
import { AuthenticateDocument } from '../../gql/graphql';
import { cognitoLogin, isUsingCognito } from '../../lib/cognitoAuth';

const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const [authenticate] = useMutation(AuthenticateDocument, {
        onCompleted: (data: { authenticate: string }) => {
            if (data?.authenticate) {
                login(data.authenticate);
                const origin = (location.state as any)?.from?.pathname || '/';
                navigate(origin);
            }
        },
        onError: (err: any) => {
            setError(err.message || 'Failed to login. Please check your credentials.');
            setLoading(false);
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setError(null);
        setLoading(true);

        if (isUsingCognito()) {
            try {
                const token = await cognitoLogin(data.username, data.password);
                login(token);
                const origin = (location.state as any)?.from?.pathname || '/';
                navigate(origin);
            } catch (err: any) {
                setError(err.message || 'Failed to login.');
            } finally {
                setLoading(false);
            }
        } else {
            authenticate({ variables: { username: data.username, password: data.password } });
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h4" align="center" gutterBottom>
                        EU Project Management
                    </Typography>
                    <Typography component="h2" variant="h6" align="center" sx={{ mb: 3 }}>
                        Sign In
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            autoComplete="username"
                            autoFocus
                            {...register('username')}
                            error={!!errors.username}
                            helperText={errors.username?.message}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginPage;
