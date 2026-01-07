import React, { useState } from 'react';
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
    MenuItem,
    Alert,
    CircularProgress,
    Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CreateProjectDocument, ProjectStatus } from '../../gql/graphql';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const projectSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    acronym: z.string().min(2, 'Acronym must be at least 2 characters').max(10, 'Acronym must be short'),
    status: z.nativeEnum(ProjectStatus),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const ProjectCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: '',
            acronym: '',
            status: ProjectStatus.Draft,
        },
    });

    const [createProject, { loading }] = useMutation(CreateProjectDocument, {
        onCompleted: () => {
            navigate('/projects');
        },
        onError: (err) => {
            setError(err.message || 'Failed to create project');
        },
    });

    const onSubmit = (data: ProjectFormValues) => {
        setError(null);
        createProject({
            variables: {
                input: {
                    title: data.title,
                    acronym: data.acronym,
                    status: data.status,
                }
            },
        });
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/projects')}
                sx={{ mb: 3 }}
            >
                Back to Projects
            </Button>

            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Create New Project
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Project Title"
                                        fullWidth
                                        required
                                        error={!!errors.title}
                                        helperText={errors.title?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="acronym"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Acronym"
                                        fullWidth
                                        required
                                        error={!!errors.acronym}
                                        helperText={errors.acronym?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Status"
                                        fullWidth
                                        required
                                        error={!!errors.status}
                                        helperText={errors.status?.message}
                                    >
                                        {Object.values(ProjectStatus).map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {status}
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
                                    onClick={() => navigate('/projects')}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Create Project'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default ProjectCreatePage;
