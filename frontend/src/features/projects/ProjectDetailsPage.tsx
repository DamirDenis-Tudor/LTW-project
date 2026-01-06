import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Tab,
    Tabs,
    CircularProgress,
    Alert,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import { GetProjectDocument, ProjectStatus, UserRole } from '../../gql/graphql';
import { useAuth } from '../auth/AuthContext';
import ProjectWorkPackageList from './components/ProjectWorkPackageList';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const ProjectDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [value, setValue] = React.useState(0);

    const { data, loading, error } = useQuery(GetProjectDocument, {
        variables: { id: id! },
        skip: !id,
        fetchPolicy: 'cache-and-network',
    });

    const project = data?.project;

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !project) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">
                    {error ? error.message : "Project not found"}
                </Alert>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/projects')}
                    sx={{ mt: 2 }}
                >
                    Back to Projects
                </Button>
            </Container>
        );
    }

    const canEdit = user?.role === UserRole.Admin || user?.role === UserRole.Manager;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/projects')}
                sx={{ mb: 2 }}
            >
                Back to Projects
            </Button>

            <Paper sx={{ p: 0, mb: 4, overflow: 'hidden' }}>
                <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                            <Box display="flex" alignItems="center" gap={2} mb={1}>
                                <Typography variant="h4" component="h1">
                                    {project.title}
                                </Typography>
                                <Paper
                                    sx={{
                                        px: 1,
                                        py: 0.5,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        color: 'inherit'
                                    }}
                                    elevation={0}
                                >
                                    <Typography variant="overline" fontWeight="bold">
                                        {project.status}
                                    </Typography>
                                </Paper>
                            </Box>
                            <Typography variant="subtitle1">
                                Acronym: {project.acronym}
                            </Typography>
                        </Box>
                        {canEdit && (
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<EditIcon />}
                            >
                                Edit Project
                            </Button>
                        )}
                    </Box>
                </Box>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="project tabs">
                        <Tab label="Overview" />
                        <Tab label="Work Packages" />
                        <Tab label="Team" />
                    </Tabs>
                </Box>

                <CustomTabPanel value={value} index={0}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h6" gutterBottom>Project Info</Typography>
                            <List>
                                <ListItem>
                                    <ListItemText primary="Title" secondary={project.title} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Acronym" secondary={project.acronym} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Status" secondary={project.status} />
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </CustomTabPanel>

                <CustomTabPanel value={value} index={1}>
                    <ProjectWorkPackageList projectId={id!} />
                </CustomTabPanel>

                <CustomTabPanel value={value} index={2}>
                    <Typography color="text.secondary">Team management coming soon (Part 2)</Typography>
                </CustomTabPanel>
            </Paper>
        </Container>
    );
};

export default ProjectDetailsPage;
