import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    Alert,
    InputAdornment,
    Skeleton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../auth/AuthContext';
import { GetProjectsDocument, ProjectStatus, UserRole, ProjectResponse, RemoveProjectDocument } from '../../gql/graphql';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditProjectDialog from './components/EditProjectDialog';
import useNotification from '../../hooks/useNotification';
import Pagination from '@mui/material/Pagination';

const ProjectListPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const notification = useNotification();
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const LIMIT = 12;

    const [editingProject, setEditingProject] = useState<ProjectResponse | null>(null);

    // Fetch projects
    const { data, loading, error, refetch } = useQuery(GetProjectsDocument, {
        variables: { limit: 100, offset: 0 },
        fetchPolicy: 'cache-and-network',
    });

    const [removeProject] = useMutation(RemoveProjectDocument, {
        onCompleted: () => {
            notification.showSuccess('Project deleted');
            refetch();
        },
        onError: (err) => notification.showError(err.message)
    });

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this project? This will remove all associated work packages and deliverables.')) {
            removeProject({ variables: { id } });
        }
    };

    const handleEdit = (e: React.MouseEvent, project: ProjectResponse) => {
        e.stopPropagation();
        setEditingProject(project);
    };

    const projects = (data?.projects.items as ProjectResponse[]) || [];

    // Filter projects locally
    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.acronym.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProjects.length / LIMIT);
    const paginatedProjects = filteredProjects.slice((page - 1) * LIMIT, page * LIMIT);

    const canCreateProject = user?.role === UserRole.Admin || user?.role === UserRole.Manager;

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1"><Skeleton width={200} /></Typography>
                </Box>
                <Paper sx={{ mb: 4, p: 2 }}>
                    <Skeleton variant="rectangular" height={56} />
                </Paper>
                <Grid container spacing={2}>
                    {Array.from(new Array(6)).map((_, index) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
                            <Card variant="outlined" sx={{ height: 200 }}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Skeleton width={60} />
                                        <Skeleton width={80} />
                                    </Box>
                                    <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
                                    <Skeleton variant="text" />
                                    <Skeleton variant="text" width="60%" />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">Error loading projects: {error.message}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1">
                    Projects
                </Typography>
                {canCreateProject && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/projects/new')}
                    >
                        Create Project
                    </Button>
                )}
            </Box>

            <Paper sx={{ mb: 4, p: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {filteredProjects.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                        {projects.length === 0 ? "No projects found." : "No projects match your search."}
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={2}>
                    {paginatedProjects.map((project) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={project.id}>
                            <Card variant="outlined" sx={{
                                height: '100%',
                                cursor: 'pointer',
                                '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' },
                                transition: 'all 0.2s',
                                position: 'relative'
                            }} onClick={() => navigate(`/projects/${project.id}`)}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <Typography variant="caption" color="text.secondary">
                                                {project.acronym}
                                            </Typography>
                                            <Box sx={{
                                                px: 1,
                                                borderRadius: 1,
                                                bgcolor: project.status === ProjectStatus.Active ? 'success.light' : 'action.selected',
                                                color: project.status === ProjectStatus.Active ? 'success.contrastText' : 'text.primary',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold'
                                            }}>
                                                {project.status}
                                            </Box>
                                        </Box>
                                        <Box>
                                            {canCreateProject && (
                                                <IconButton size="small" onClick={(e) => handleEdit(e, project)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                            {user?.role === UserRole.Admin && (
                                                <IconButton size="small" color="error" onClick={(e) => handleDelete(e, project.id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </Box>
                                    <Typography variant="h6" component="div" gutterBottom>
                                        {project.title}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, p) => setPage(p)}
                        color="primary"
                    />
                </Box>
            )}

            {editingProject && (
                <EditProjectDialog
                    open={!!editingProject}
                    onClose={() => setEditingProject(null)}
                    project={editingProject}
                    onUpdated={() => refetch()}
                />
            )}
        </Container>
    );
};

export default ProjectListPage;
