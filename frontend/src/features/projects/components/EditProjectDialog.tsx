import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client/react';
import { UpdateProjectDocument, ProjectStatus } from '../../../gql/graphql';
import useNotification from '../../../hooks/useNotification';

const schema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    acronym: z.string().min(2, "Acronym must be at least 2 characters"),
    status: z.nativeEnum(ProjectStatus),
});

type FormValues = z.infer<typeof schema>;

interface EditProjectDialogProps {
    open: boolean;
    onClose: () => void;
    project: {
        id: string;
        title: string;
        acronym: string;
        status: ProjectStatus;
    };
    onUpdated: () => void;
}

const EditProjectDialog: React.FC<EditProjectDialogProps> = ({ open, onClose, project, onUpdated }) => {
    const notification = useNotification();
    const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: project.title,
            acronym: project.acronym,
            status: project.status,
        }
    });

    const [updateProject, { loading }] = useMutation(UpdateProjectDocument, {
        onCompleted: () => {
            notification.showSuccess('Project updated successfully');
            onUpdated();
            onClose();
        },
        onError: (err) => notification.showError(err.message)
    });

    const onSubmit = (data: FormValues) => {
        updateProject({
            variables: {
                id: project.id,
                input: data
            }
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Project</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Project Title"
                                fullWidth
                                margin="normal"
                                error={!!errors.title}
                                helperText={errors.title?.message}
                            />
                        )}
                    />
                    <Controller
                        name="acronym"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Acronym"
                                fullWidth
                                margin="normal"
                                error={!!errors.acronym}
                                helperText={errors.acronym?.message}
                            />
                        )}
                    />
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Status"
                                fullWidth
                                margin="normal"
                                error={!!errors.status}
                                helperText={errors.status?.message}
                            >
                                {Object.values(ProjectStatus).map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditProjectDialog;
