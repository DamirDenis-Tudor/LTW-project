import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@apollo/client/react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    CircularProgress,
    Alert,
    Box
} from '@mui/material';
import { CreateDeliverableDocument, GetWorkPackageWithDeliverablesDocument, GetProjectWithPartnersDocument } from '../../../gql/graphql';
import { useAuth } from '../../auth/AuthContext';
import { UserRole } from '../../../gql/graphql';

const deliverableSchema = z.object({
    description: z.string().min(3, 'Description is required'),
    dueDate: z.string().min(1, 'Due Date is required'),
    assignedTo: z.string().min(1, 'Assignee is required'),
});

type DeliverableFormValues = z.infer<typeof deliverableSchema>;

interface DeliverableCreateDialogProps {
    open: boolean;
    onClose: () => void;
    workPackageId: string;
    partners: any[];
    onCreated?: () => void;
}

const DeliverableCreateDialog: React.FC<DeliverableCreateDialogProps> = ({ open, onClose, workPackageId, partners, onCreated }) => {
    const { user } = useAuth();


    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<DeliverableFormValues>({
        resolver: zodResolver(deliverableSchema),
        defaultValues: {
            description: '',
            dueDate: '',
            assignedTo: '',
        },
    });

    const [createDeliverable, { loading }] = useMutation(CreateDeliverableDocument, {
        onCompleted: () => {
            reset();
            onCreated?.();
            onClose();
        }
    });

    const onSubmit = (data: DeliverableFormValues) => {
        createDeliverable({
            variables: {
                wpId: workPackageId,
                input: {
                    description: data.description,
                    dueDate: data.dueDate,
                    assignedTo: data.assignedTo,
                }
            }
        });
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Deliverable</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Description"
                                    fullWidth
                                    required
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                />
                            )}
                        />
                        <Controller
                            name="dueDate"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Due Date"
                                    type="date"
                                    fullWidth
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.dueDate}
                                    helperText={errors.dueDate?.message}
                                />
                            )}
                        />
                        <Controller
                            name="assignedTo"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Assign To"
                                    fullWidth
                                    required
                                    error={!!errors.assignedTo}
                                    helperText={errors.assignedTo?.message}
                                >
                                    {partners.map((p: any) => (
                                        <MenuItem key={p.id} value={p.id}>
                                            {p.username}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );

    function handleClose() {
        reset();
        onClose();
    }
};

export default DeliverableCreateDialog;
