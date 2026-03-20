import React, { createContext, useContext, useState, useCallback } from 'react';

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
    const [dialog, setDialog] = useState({
        isOpen: false,
        type: 'alert', // 'alert' or 'confirm'
        title: '',
        message: '',
        onConfirm: null,
        onCancel: null
    });

    const showAlert = useCallback((message, title = 'Notification') => {
        return new Promise((resolve) => {
            setDialog({
                isOpen: true,
                type: 'alert',
                title,
                message,
                onConfirm: () => {
                    setDialog(prev => ({ ...prev, isOpen: false }));
                    resolve(true);
                }
            });
        });
    }, []);

    const showConfirm = useCallback((message, title = 'Confirmation') => {
        return new Promise((resolve) => {
            setDialog({
                isOpen: true,
                type: 'confirm',
                title,
                message,
                onConfirm: () => {
                    setDialog(prev => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                onCancel: () => {
                    setDialog(prev => ({ ...prev, isOpen: false }));
                    resolve(false);
                }
            });
        });
    }, []);

    const closeDialog = useCallback(() => {
        setDialog(prev => ({ ...prev, isOpen: false }));
    }, []);

    return (
        <DialogContext.Provider value={{ showAlert, showConfirm, closeDialog, dialog }}>
            {children}
        </DialogContext.Provider>
    );
};

export const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
};
