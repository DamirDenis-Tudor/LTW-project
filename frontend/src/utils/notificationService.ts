import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';

let snackbarRef: { enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey } | null = null;

export const NotificationService = {
    setRef: (ref: any) => {
        snackbarRef = ref;
    },
    enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => {
        if (snackbarRef) {
            return snackbarRef.enqueueSnackbar(message, options);
        }
        return '';
    },
    error: (message: string) => {
        if (snackbarRef) {
            snackbarRef.enqueueSnackbar(message, { variant: 'error' });
        }
    },
    success: (message: string) => {
        if (snackbarRef) {
            snackbarRef.enqueueSnackbar(message, { variant: 'success' });
        }
    }
};
