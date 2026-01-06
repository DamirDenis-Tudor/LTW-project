import React from 'react';
import { useQuery } from '@apollo/client/react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Alert
} from '@mui/material';
import { useAuth } from '../auth/AuthContext';
import { GetProjectsDocument, ProjectStatus, ProjectResponse } from '../../gql/graphql';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch projects to show stats/list
    const { data, loading, error } = useQuery(GetProjectsDocument, {
        variables: { limit: 10, offset: 0 },
        fetchPolicy: 'cache-and-network',
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">Error loading dashboard: {error.message}</Alert>
            </Container>
        );
    }

    const projects = (data?.projects.items as ProjectResponse[]) || [];
    const totalProjects = data?.projects.totalCount || 0;

    // Simple stats calculation
    const activeProjects = projects.filter((p) => p.status === ProjectStatus.Active).length;
    const completedProjects = projects.filter((p) => p.status === ProjectStatus.Completed).length;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome back, {user?.username}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Role: {user?.role}
                </Typography>
            </Box>

            {/* Stats Overview */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card elevation={2}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Total Projects
                            </Typography>
                            <Typography variant="h4">
                                {totalProjects}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card elevation={2}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Active
                            </Typography>
                            <Typography variant="h4" color="primary">
                                {activeProjects}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card elevation={2}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Completed
                            </Typography>
                            <Typography variant="h4" color="success.main">
                                {completedProjects}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Projects Section */}
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Recent Projects
                </Typography>
                {projects.length === 0 ? (
                    <Typography color="text.secondary">No projects found.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {projects.map((project) => (
                            <Grid size={{ xs: 12 }} key={project.id}>
                                <Card variant="outlined" sx={{
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: 'action.hover' }
                                }} onClick={() => navigate(`/projects/${project.id}`)}>
                                    <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid size={{ xs: 8 }}>
                                                <Typography variant="subtitle1" component="div">
                                                    {project.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {project.acronym}
                                                </Typography>
                                            </Grid>
                                            <Grid>
                                                <Box sx={{
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    bgcolor: project.status === ProjectStatus.Active ? 'success.light' : 'action.selected',
                                                    color: project.status === ProjectStatus.Active ? 'success.contrastText' : 'text.primary',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {project.status}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>
        </Container>
    );
};

export default DashboardPage;
