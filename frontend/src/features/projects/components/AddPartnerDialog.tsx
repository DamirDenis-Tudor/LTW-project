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
import { GetOrganizationsDocument, AssignPartnerToProjectDocument } from '../../../gql/graphql';
import useNotification from '../../../hooks/useNotification';

interface AddPartnerDialogProps {
    open: boolean;
    onClose: () => void;
    projectId: string;
    onAdded: () => void;
}

const schema = z.object({
    partnerId: z.string().min(1, "Please select an organization"),
});

type FormValues = z.infer<typeof schema>;

const AddPartnerDialog: React.FC<AddPartnerDialogProps> = ({ open, onClose, projectId, onAdded }) => {
    const notification = useNotification();
    const { control, handleSubmit, reset } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const { data: orgsData, loading: orgsLoading } = useQuery(GetOrganizationsDocument, {
        variables: { limit: 100, offset: 0 },
        fetchPolicy: 'network-only',
    });

    const [assignPartner, { loading: submitting }] = useMutation(AssignPartnerToProjectDocument, {
        onCompleted: () => {
            notification.showSuccess('Partner added successfully');
            onAdded();
            handleClose();
        },
        onError: (err) => {
            notification.showError(`Failed to add partner: ${err.message}`);
        }
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = (data: FormValues) => {
        assignPartner({
            variables: {
                projectId,
                partnerId: data.partnerId
            }
        });
    };

    const organizations = orgsData?.organizations?.items || [];

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Partner to Project</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    {orgsLoading ? (
                        <Box display="flex" justifyContent="center" p={2}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Controller
                            name="partnerId"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Select Organization"
                                    fullWidth
                                    margin="normal"
                                    error={!!control.getFieldState("partnerId").error}
                                    helperText={control.getFieldState("partnerId").error?.message}
                                >
                                    {organizations.map((org: any) => (
                                        <MenuItem key={org.id} value={org.id}>
                                            {org.name} ({org.country})
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
                        {submitting ? 'Adding...' : 'Add Partner'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddPartnerDialog;
