import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
    Pagination,
    Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import { GetOrganizationsDocument } from '../../gql/graphql';
import { useNavigate } from 'react-router-dom';
import TableSkeleton from '../../components/common/TableSkeleton';

const OrganizationListPage: React.FC = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const LIMIT = 10;

    const { data, loading, error } = useQuery(GetOrganizationsDocument, {
        variables: { limit: LIMIT, offset: (page - 1) * LIMIT },
        fetchPolicy: 'cache-and-network',
    });

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <BusinessIcon color="primary" fontSize="large" />
                        <Typography variant="h4" component="h1">
                            Organizations
                        </Typography>
                    </Box>
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Country</TableCell>
                                <TableCell>PIC Code</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableSkeleton rows={LIMIT} columns={3} />
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">Error loading organizations: {error.message}</Alert>
            </Container>
        );
    }

    const organizations = data?.organizations?.items || [];
    const totalCount = data?.organizations?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / LIMIT);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={1}>
                    <BusinessIcon color="primary" fontSize="large" />
                    <Typography variant="h4" component="h1">
                        Organizations
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/organizations/new')}
                >
                    Add Organization
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>PIC Code</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {organizations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    No organizations found
                                </TableCell>
                            </TableRow>
                        ) : (
                            organizations.map((org: any) => (
                                <TableRow key={org.id} hover>
                                    <TableCell>
                                        <Typography variant="subtitle1" fontWeight="medium">
                                            {org.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{org.country}</TableCell>
                                    <TableCell>
                                        <Chip label={org.picCode} size="small" variant="outlined" />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

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
        </Container>
    );
};

export default OrganizationListPage;
