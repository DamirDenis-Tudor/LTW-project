import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@apollo/client/react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CreateOrganizationDocument } from '../../gql/graphql';

const orgSchema = z.object({
    name: z.string().min(3, 'Name is required'),
    country: z.string().min(2, 'Country is required'),
    picCode: z.coerce.number().min(100000, 'PIC Code must be at least 6 digits').max(999999999, 'PIC Code too long'),
});

type OrgFormValues = {
    name: string;
    country: string;
    picCode: number | string;
};

const OrganizationCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<OrgFormValues>({
        resolver: zodResolver(orgSchema) as any,
        defaultValues: {
            name: '',
            country: '',
            picCode: '',
        },
    });

    const [createOrg, { loading }] = useMutation(CreateOrganizationDocument, {
        onCompleted: () => {
            navigate('/organizations');
        },
        onError: (err) => {
            setError(err.message || 'Failed to create organization');
        },
    });

    const onSubmit = (data: OrgFormValues) => {
        setError(null);
        createOrg({
            variables: {
                input: {
                    name: data.name,
                    country: data.country,
                    picCode: Number(data.picCode),
                }
            }
        });
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/organizations')}
                sx={{ mb: 3 }}
            >
                Back to List
            </Button>

            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Register New Organization
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Organization Name"
                                        fullWidth
                                        required
                                        error={!!errors.name}
                                        helperText={errors.name?.message as string}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="country"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Country"
                                        fullWidth
                                        required
                                        error={!!errors.country}
                                        helperText={errors.country?.message as string}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="picCode"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="PIC Code"
                                        type="number"
                                        fullWidth
                                        required
                                        error={!!errors.picCode}
                                        helperText={errors.picCode?.message as string}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/organizations')}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Create Organization'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default OrganizationCreatePage;
