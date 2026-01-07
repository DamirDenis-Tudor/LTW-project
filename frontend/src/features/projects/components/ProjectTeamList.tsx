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
import { GetProjectTeamDocument, UserRole } from '../../../gql/graphql';
import TableSkeleton from '../../../components/common/TableSkeleton';
import { useAuth } from '../../auth/AuthContext';
import AddManagerDialog from './AddManagerDialog';
import AddPartnerDialog from './AddPartnerDialog';

interface ProjectTeamListProps {
    projectId: string;
}

const ProjectTeamList: React.FC<ProjectTeamListProps> = ({ projectId }) => {
    const { user } = useAuth();
    const { data, loading, error, refetch } = useQuery(GetProjectTeamDocument, {
        variables: { id: projectId },
        fetchPolicy: 'cache-first',
    });

    const [openAddManager, setOpenAddManager] = useState(false);
    const [openAddPartner, setOpenAddPartner] = useState(false);

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
                                            <Chip label="Manager" size="small" color="primary" variant="outlined" />
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
                                                <Chip label={partner.organization.name} size="small" color="secondary" variant="outlined" />
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
                onAdded={() => refetch()}
            />
            <AddPartnerDialog
                open={openAddPartner}
                onClose={() => setOpenAddPartner(false)}
                projectId={projectId}
                onAdded={() => refetch()}
            />
        </Box>
    );
};

export default ProjectTeamList;
