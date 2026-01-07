import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Grid,
    Alert,
    Chip,
    Card,
    CardContent,
    Button
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    GetProjectTeamDocument,
    UserRole,
    RemovePartnerFromProjectDocument,
    RemoveManagerFromProjectDocument
} from '../../../gql/graphql';
import TableSkeleton from '../../../components/common/TableSkeleton';
import { useAuth } from '../../auth/AuthContext';
import AddManagerDialog from './AddManagerDialog';
import AddPartnerDialog from './AddPartnerDialog';
import useNotification from '../../../hooks/useNotification';
import { useMutation } from '@apollo/client/react';
import IconButton from '@mui/material/IconButton';

interface ProjectTeamListProps {
    projectId: string;
}

const ProjectTeamList: React.FC<ProjectTeamListProps> = ({ projectId }) => {
    const { user } = useAuth();
    const notification = useNotification();
    const { data, loading, error, refetch } = useQuery(GetProjectTeamDocument, {
        variables: { id: projectId },
        fetchPolicy: 'cache-and-network',
    });

    const [openAddManager, setOpenAddManager] = useState(false);
    const [openAddPartner, setOpenAddPartner] = useState(false);

    const [removePartner] = useMutation(RemovePartnerFromProjectDocument, {
        onCompleted: () => {
            notification.showSuccess('Partner removed');
            refetch();
        },
        onError: (err) => notification.showError(err.message)
    });

    const [removeManager] = useMutation(RemoveManagerFromProjectDocument, {
        onCompleted: () => {
            notification.showSuccess('Manager removed');
            refetch();
        },
        onError: (err) => notification.showError(err.message)
    });

    const handleRemovePartner = (partnerId: string) => {
        if (window.confirm('Are you sure you want to remove this partner?')) {
            removePartner({ variables: { projectId, partnerId } });
        }
    };

    const handleRemoveManager = (managerId: string) => {
        if (window.confirm('Are you sure you want to remove this manager?')) {
            removeManager({ variables: { projectId, managerId } });
        }
    };

    if (loading) {
        return (
            <Box sx={{ mt: 2 }}>
                <TableSkeleton rows={3} columns={2} />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">Error loading team: {error.message}</Alert>;
    }

    const managers = data?.project?.managers?.items || [];
    const partners = data?.project?.partners?.items || [];

    // Only Admins and Managers can edit team
    const canEdit = user?.role === UserRole.Admin || user?.role === UserRole.Manager;

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                    Project Team
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box display="flex" alignItems="center">
                                    <PersonIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="h6">Managers</Typography>
                                </Box>
                                {canEdit && (
                                    <Button
                                        size="small"
                                        startIcon={<AddIcon />}
                                        onClick={() => setOpenAddManager(true)}
                                    >
                                        Add
                                    </Button>
                                )}
                            </Box>

                            {managers.length === 0 ? (
                                <Typography color="text.secondary">No managers assigned.</Typography>
                            ) : (
                                <List>
                                    {managers.map((manager: any) => (
                                        <ListItem key={manager.id}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <PersonIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={manager.username}
                                                secondary={manager.email}
                                            />
                                            <Chip label="Manager" size="small" color="primary" variant="outlined" sx={{ mr: 1 }} />
                                            {user?.role === UserRole.Admin && (
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    size="small"
                                                    onClick={() => handleRemoveManager(manager.id)}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box display="flex" alignItems="center">
                                    <BusinessIcon color="secondary" sx={{ mr: 1 }} />
                                    <Typography variant="h6">Partners</Typography>
                                </Box>
                                {canEdit && (
                                    <Button
                                        size="small"
                                        startIcon={<AddIcon />}
                                        onClick={() => setOpenAddPartner(true)}
                                    >
                                        Add
                                    </Button>
                                )}
                            </Box>

                            {partners.length === 0 ? (
                                <Typography color="text.secondary">No partners assigned.</Typography>
                            ) : (
                                <List>
                                    {partners.map((partner: any) => (
                                        <ListItem key={partner.id}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                                    <BusinessIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={partner.organization?.name || partner.username}
                                                secondary={partner.organization?.name ? `Rep: ${partner.username}` : partner.email}
                                            />
                                            {partner.organization && (
                                                <Chip label={partner.organization.name} size="small" color="secondary" variant="outlined" sx={{ mr: 1 }} />
                                            )}
                                            {canEdit && (
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    size="small"
                                                    onClick={() => handleRemovePartner(partner.id)}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Dialogs */}
            <AddManagerDialog
                open={openAddManager}
                onClose={() => setOpenAddManager(false)}
                projectId={projectId}
                existingIds={managers.map((m: any) => m.id)}
                onAdded={() => refetch()}
            />
            <AddPartnerDialog
                open={openAddPartner}
                onClose={() => setOpenAddPartner(false)}
                projectId={projectId}
                existingIds={partners.map((p: any) => p.id)}
                onAdded={() => refetch()}
            />
        </Box>
    );
};

export default ProjectTeamList;
