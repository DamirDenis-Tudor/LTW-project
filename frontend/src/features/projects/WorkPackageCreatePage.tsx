import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@apollo/client/react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CreateWorkPackageDocument, GetProjectWithPartnersDocument } from '../../gql/graphql';

// 1. Define schema with coercion
const wpSchema = z.object({
    title: z.string().min(3, 'Title is required'),
    wpNumber: z.coerce.number().min(1, 'WP Number must be positive'),
    leadPartnerId: z.string().min(1, 'Lead Partner is required'),
});

// 2. Define inferred type
type WPFormValues = z.infer<typeof wpSchema>;

const WorkPackageCreatePage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    // Fetch project partners
    const { data: projectData, loading: projectLoading } = useQuery(GetProjectWithPartnersDocument, {
        variables: { id: projectId!, partnersLimit: 50, partnersOffset: 0 },
        skip: !projectId
    });

    const partners = projectData?.project?.partners?.items || [];
    const projectTitle = projectData?.project?.title || '';

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<WPFormValues>({
        resolver: zodResolver(wpSchema) as any,
        defaultValues: {
            wpNumber: 1,
            title: '',
            leadPartnerId: '',
        },
    });

    const [createWP, { loading: creating }] = useMutation(CreateWorkPackageDocument, {
        onCompleted: () => {
            navigate(`/projects/${projectId}`);
        },
        onError: (err) => {
            setError(err.message || 'Failed to create work package');
        },
    });

    const onSubmit = (data: WPFormValues) => {
        if (!projectId) return;
        setError(null);
        createWP({
            variables: {
                input: {
                    projectId: projectId,
                    wpNumber: data.wpNumber,
                    title: data.title,
                    leadPartnerId: data.leadPartnerId,
                }
            }
        });
    };

    if (projectLoading) {
        return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(`/projects/${projectId}`)}
                sx={{ mb: 3 }}
            >
                Back to Project
            </Button>

            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Add Work Package for {projectTitle}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Controller
                                name="wpNumber"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="WP Number"
                                        type="number"
                                        fullWidth
                                        required
                                        error={!!errors.wpNumber}
                                        helperText={errors.wpNumber?.message}
                                        slotProps={{
                                            htmlInput: { min: 1 }
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 8 }}>
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Title"
                                        fullWidth
                                        required
                                        error={!!errors.title}
                                        helperText={errors.title?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="leadPartnerId"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Lead Partner"
                                        fullWidth
                                        required
                                        error={!!errors.leadPartnerId}
                                        helperText={errors.leadPartnerId?.message}
                                    >
                                        {partners.map((partner: any) => (
                                            <MenuItem key={partner.id} value={partner.id}>
                                                {partner.username} ({partner.organization?.name})
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate(`/projects/${projectId}`)}
                                    disabled={creating}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={creating}
                                >
                                    {creating ? <CircularProgress size={24} /> : 'Create WP'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default WorkPackageCreatePage;
