import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Pagination,
    Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { GetProjectWithWorkPackagesDocument, WorkPackageResponse } from '../../../gql/graphql';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { UserRole } from '../../../gql/graphql';

interface ProjectWorkPackageListProps {
    projectId: string;
}

const ProjectWorkPackageList: React.FC<ProjectWorkPackageListProps> = ({ projectId }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const LIMIT = 10;

    const { data, loading, error } = useQuery(GetProjectWithWorkPackagesDocument, {
        variables: {
            id: projectId,
            wpLimit: LIMIT,
            wpOffset: (page - 1) * LIMIT
        },
        fetchPolicy: 'cache-and-network',
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">Error loading work packages: {error.message}</Alert>;
    }

    const workPackages = data?.project?.workPackages?.items || [];
    const totalCount = data?.project?.workPackages?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / LIMIT);

    const canCreate = user?.role === UserRole.Admin || user?.role === UserRole.Manager;

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Work Packages</Typography>
                {canCreate && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/projects/${projectId}/work-packages/new`)}
                    >
                        Add Work Package
                    </Button>
                )}
            </Box>

            {workPackages.length === 0 ? (
                <Typography color="text.secondary">No work packages found.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {workPackages.map((wp: any) => (
                        <Grid size={{ xs: 12 }} key={wp.id}>
                            <Card variant="outlined" sx={{
                                cursor: 'pointer',
                                '&:hover': { bgcolor: 'action.hover' }
                            }} onClick={() => navigate(`/work-packages/${wp.id}`)}>
                                <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                                    <Grid container alignItems="center" justifyContent="space-between">
                                        <Grid size={{ xs: 10 }}>
                                            <Typography variant="subtitle1">
                                                WP{wp.wpNumber}: {wp.title}
                                            </Typography>
                                            {wp.leadPartner && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Lead: {wp.leadPartner.username}
                                                </Typography>
                                            )}
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={3}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, p) => setPage(p)}
                        color="primary"
                    />
                </Box>
            )}
        </Box>
    );
};

export default ProjectWorkPackageList;
