export const notificationSlice = (set) => ({
    message: null,
    errorMessage: null,
    loading: false,
    setIsloading: (loading) => set({ loading }),
    setMessage: (message) => {
        set({ message });
        setTimeout(() => {
            set({ message: null })
        }, 2000);
    },
    setErrorMessage: (errorMessage) => {
        set({ errorMessage });
        setTimeout(() => {
            set({ errorMessage: null })
        }, 2000);
    },
})