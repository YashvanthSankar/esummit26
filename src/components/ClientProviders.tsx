'use client';

import dynamic from 'next/dynamic';

// Lazy load CustomCursor only on desktop (saves ~15KB on mobile)
const CustomCursor = dynamic(() => import('@/components/CustomCursor'), {
    ssr: false,
    loading: () => null,
});

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <>
            <CustomCursor />
            {children}
        </>
    );
}
