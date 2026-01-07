import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    CircularProgress,
    Box
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { GetUsersDocument, AssignManagerToProjectDocument, UserRole } from '../../../gql/graphql';
import useNotification from '../../../hooks/useNotification';

interface AddManagerDialogProps {
    open: boolean;
    onClose: () => void;
    projectId: string;
    existingIds: string[];
    onAdded: () => void;
}

const schema = z.object({
    userId: z.string().min(1, "Please select a manager"),
});

type FormValues = z.infer<typeof schema>;

const AddManagerDialog: React.FC<AddManagerDialogProps> = ({ open, onClose, projectId, existingIds, onAdded }) => {
    const notification = useNotification();
    const { control, handleSubmit, reset } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const { data: usersData, loading: usersLoading } = useQuery(GetUsersDocument, {
        variables: { limit: 100, offset: 0 },
        fetchPolicy: 'network-only',
    });

    const [assignManager, { loading: submitting }] = useMutation(AssignManagerToProjectDocument, {
        onCompleted: () => {
            notification.showSuccess('Manager added successfully');
            onAdded();
            handleClose();
        },
        onError: (err) => {
            notification.showError(`Failed to add manager: ${err.message}`);
        }
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = (data: FormValues) => {
        assignManager({
            variables: {
                projectId,
                managerId: data.userId
            }
        });
    };

    const potentialManagers = usersData?.users?.items?.filter(u =>
        (u.role === UserRole.Manager || u.role === UserRole.Admin) && !existingIds.includes(u.id)
    ) || [];

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Manager to Project</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    {usersLoading ? (
                        <Box display="flex" justifyContent="center" p={2}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Controller
                            name="userId"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Select Manager"
                                    fullWidth
                                    margin="normal"
                                    error={!!control.getFieldState("userId").error}
                                    helperText={control.getFieldState("userId").error?.message}
                                >
                                    {potentialManagers.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.username} ({user.email}) - {user.role}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={submitting}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Adding...' : 'Add Manager'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddManagerDialog;
