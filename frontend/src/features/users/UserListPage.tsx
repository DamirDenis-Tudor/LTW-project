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
import PeopleIcon from '@mui/icons-material/People';
import { GetUsersDocument } from '../../gql/graphql';
import { useNavigate } from 'react-router-dom';
import TableSkeleton from '../../components/common/TableSkeleton';

const UserListPage: React.FC = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const LIMIT = 10;

    const { data, loading, error } = useQuery(GetUsersDocument, {
        variables: { limit: LIMIT, offset: (page - 1) * LIMIT },
        fetchPolicy: 'cache-and-network',
    });

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <PeopleIcon color="primary" fontSize="large" />
                        <Typography variant="h4" component="h1">
                            Users
                        </Typography>
                    </Box>
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Organization</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableSkeleton rows={LIMIT} columns={4} />
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">Error loading users: {error.message}</Alert>
            </Container>
        );
    }

    const users = data?.users?.items || [];
    const totalCount = data?.users?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / LIMIT);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={1}>
                    <PeopleIcon color="primary" fontSize="large" />
                    <Typography variant="h4" component="h1">
                        Users
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/users/new')}
                >
                    Add User
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Organization</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((u: any) => (
                                <TableRow key={u.id} hover>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="medium">
                                            {u.username}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={u.role}
                                            size="small"
                                            color={u.role === 'ADMIN' ? 'error' : u.role === 'MANAGER' ? 'primary' : 'default'}
                                        />
                                    </TableCell>
                                    <TableCell>{u.organizationId || 'N/A'}</TableCell>
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

export default UserListPage;
