import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    CircularProgress,
    Alert,
    Grid,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { GetWorkPackageWithDeliverablesDocument, WorkPackageResponse, UserRole } from '../../gql/graphql';
import DeliverableCreateDialog from './components/DeliverableCreateDialog';
import { useAuth } from '../auth/AuthContext';

const WorkPackageDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { user } = useAuth();
    const canCreateDeliverable = user?.role === UserRole.Admin || user?.role === UserRole.Manager;

    const { data, loading, error } = useQuery(GetWorkPackageWithDeliverablesDocument, {
        variables: {
            id: id!,
            limit: 10,
            offset: 0
        },
        skip: !id,
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
                <Alert severity="error">Error loading work package: {error.message}</Alert>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mt: 2 }}
                >
                    Go Back
                </Button>
            </Container>
        );
    }

    const workPackage = data?.workPackage as WorkPackageResponse;

    if (!workPackage) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="warning">Work Package not found</Alert>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mt: 2 }}
                >
                    Go Back
                </Button>
            </Container>
        );
    }

    const deliverables = workPackage.deliverables?.items || [];
    // @ts-ignore - 'project' might not be in the generated type definition yet if codegen didn't run perfectly or interface merging is strict
    // but the query was updated to fetch it.
    const partners = workPackage.project?.partners?.items || [];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
                {canCreateDeliverable && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setIsDialogOpen(true)}
                    >
                        Add Deliverable
                    </Button>
                )}
            </Box>

            <Paper sx={{ p: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    WP{workPackage.wpNumber}: {workPackage.title}
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>Deliverables</Typography>
                {deliverables.length === 0 ? (
                    <Typography color="text.secondary">No deliverables found.</Typography>
                ) : (
                    <List>
                        {deliverables.map((del: any) => (
                            <ListItem key={del.id} divider>
                                <ListItemText
                                    primary={del.description}
                                    secondary={`Due: ${del.dueDate} | Assigned to: ${del.assignedUser?.username || 'Unassigned'}`}
                                />
                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            px: 1, py: 0.5, borderRadius: 1,
                                            bgcolor: del.isSubmitted ? 'success.light' : 'warning.light',
                                            color: del.isSubmitted ? 'success.contrastText' : 'warning.contrastText'
                                        }}
                                    >
                                        {del.isSubmitted ? 'Submitted' : 'Pending'}
                                    </Typography>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>

            {canCreateDeliverable && (
                <DeliverableCreateDialog
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    workPackageId={id!}
                    partners={partners}
                />
            )}
        </Container>
    );
};

export default WorkPackageDetailsPage;
