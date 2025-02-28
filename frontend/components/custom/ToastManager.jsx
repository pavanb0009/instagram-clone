"use client";

import { Toaster, toast } from 'react-hot-toast';
import { useEffect } from 'react';
import manageStore from '@/lib/store/store';

const ToastManager = () => {
    const { message, errorMessage } = manageStore();


    useEffect(() => {
        if (message) {
            toast.success(message);
        }
        if (errorMessage) {
            toast.error(errorMessage, {
                style: {
                    background: '#fef2f2',
                    color: '#dc2626',
                },
            });

        }

    }, [message, errorMessage]);

    return <Toaster />;
};

export default ToastManager;
