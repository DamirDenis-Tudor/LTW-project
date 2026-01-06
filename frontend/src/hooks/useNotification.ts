import { useSnackbar, VariantType } from 'notistack';

const useNotification = () => {
    const { enqueueSnackbar } = useSnackbar();

    const showNotification = (message: string, variant: VariantType = 'default') => {
        enqueueSnackbar(message, {
            variant,
            autoHideDuration: 3000,
            anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
        });
    };

    return {
        showSuccess: (message: string) => showNotification(message, 'success'),
        showError: (message: string) => showNotification(message, 'error'),
        showInfo: (message: string) => showNotification(message, 'info'),
        showWarning: (message: string) => showNotification(message, 'warning'),
    };
};

export default useNotification;
