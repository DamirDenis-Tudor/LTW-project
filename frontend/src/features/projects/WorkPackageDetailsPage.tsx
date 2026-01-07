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
import { GetWorkPackageWithDeliverablesDocument, WorkPackageResponse, UserRole, SubmitDeliverableDocument } from '../../gql/graphql';
import DeliverableCreateDialog from './components/DeliverableCreateDialog';
import { useAuth } from '../auth/AuthContext';
import { useMutation } from '@apollo/client/react';
import useNotification from '../../hooks/useNotification';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    IconButton
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const WorkPackageDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const notification = useNotification();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const { user } = useAuth();

    const canCreateDeliverable = user?.role === UserRole.Admin || user?.role === UserRole.Manager;

    const { data, loading, error, refetch } = useQuery(GetWorkPackageWithDeliverablesDocument, {
        variables: {
            id: id!,
            limit: 100,
            offset: 0,
            isSubmitted: statusFilter === 'ALL' ? null : statusFilter === 'SUBMITTED'
        },
        skip: !id,
        fetchPolicy: 'cache-and-network',
    });

    const [updateStatus] = useMutation(SubmitDeliverableDocument, {
        onCompleted: () => {
            notification.showSuccess('Status updated');
            refetch();
        },
        onError: (err) => notification.showError(err.message)
    });

    const handleToggleStatus = (deliverableId: string, currentStatus: boolean) => {
        updateStatus({
            variables: {
                id: deliverableId,
                status: !currentStatus
            }
        });
    };

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

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Deliverables</Typography>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Status"
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="ALL">All</MenuItem>
                            <MenuItem value="SUBMITTED">Submitted</MenuItem>
                            <MenuItem value="PENDING">Pending</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {deliverables.length === 0 ? (
                    <Typography color="text.secondary">No deliverables found.</Typography>
                ) : (
                    <List>
                        {deliverables.map((del: any) => {
                            const canToggle = user?.role === UserRole.Admin ||
                                (user?.role === UserRole.Manager) ||
                                (user?.role === UserRole.Partner && del.assignedTo === user.id);

                            return (
                                <ListItem
                                    key={del.id}
                                    divider
                                    secondaryAction={
                                        canToggle && (
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleToggleStatus(del.id, del.isSubmitted)}
                                                color={del.isSubmitted ? "success" : "default"}
                                            >
                                                {del.isSubmitted ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                                            </IconButton>
                                        )
                                    }
                                >
                                    <ListItemText
                                        primary={del.description}
                                        secondary={`Due: ${del.dueDate} | Assigned to: ${del.assignedUser?.username || 'Unassigned'}`}
                                    />
                                    <Box sx={{ mr: 4 }}>
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
                            );
                        })}
                    </List>
                )}
            </Paper>

            {canCreateDeliverable && (
                <DeliverableCreateDialog
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    workPackageId={id!}
                    partners={partners}
                    onCreated={refetch}
                />
            )}
        </Container>
    );
};

export default WorkPackageDetailsPage;
