import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@apollo/client/react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    MenuItem,
    Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { RegisterUserDocument, GetOrganizationsDocument, UserRole } from '../../gql/graphql';

const userSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 chars'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 chars'),
    role: z.nativeEnum(UserRole), // Use generated enum
    organizationId: z.string().optional(), // Can match a real org ID
});

type UserFormValues = z.infer<typeof userSchema>;

const UserCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    // Fetch organizations for selector
    const { data: orgData } = useQuery(GetOrganizationsDocument, {
        variables: { limit: 100, offset: 0 }
    });
    const organizations = orgData?.organizations?.items || [];

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            role: UserRole.Partner,
            organizationId: '',
        },
    });

    const selectedRole = watch('role');

    const [registerUser, { loading }] = useMutation(RegisterUserDocument, {
        onCompleted: () => {
            navigate('/users');
        },
        onError: (err) => {
            setError(err.message || 'Failed to register user');
        },
    });

    const onSubmit = (data: UserFormValues) => {
        setError(null);
        registerUser({
            variables: {
                input: {
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    role: data.role,
                    organizationId: data.organizationId || undefined,
                }
            }
        });
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/users')}
                sx={{ mb: 3 }}
            >
                Back to List
            </Button>

            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Register New User
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="username"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Username"
                                        fullWidth
                                        required
                                        error={!!errors.username}
                                        helperText={errors.username?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Email"
                                        fullWidth
                                        required
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Password"
                                        type="password"
                                        fullWidth
                                        required
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Role"
                                        fullWidth
                                        required
                                        error={!!errors.role}
                                        helperText={errors.role?.message}
                                    >
                                        {Object.values(UserRole).map((role) => (
                                            <MenuItem key={role} value={role}>
                                                {role}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>

                        {(selectedRole === UserRole.Manager || selectedRole === UserRole.Partner) && (
                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="organizationId"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Organization"
                                            fullWidth
                                            required={true}
                                            error={!!errors.organizationId}
                                            helperText={errors.organizationId?.message}
                                        >
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            {organizations.map((org: any) => (
                                                <MenuItem key={org.id} value={org.id}>
                                                    {org.name} ({org.country})
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>
                        )}

                        <Grid size={{ xs: 12 }}>
                            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/users')}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Create User'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default UserCreatePage;
