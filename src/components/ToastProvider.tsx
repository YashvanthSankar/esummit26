'use client';

import { Toaster } from 'sonner';

export default function ToastProvider() {
    return (
        <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
                style: {
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                },
                className: 'font-body',
            }}
            richColors
        />
    );
}
