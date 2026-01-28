import { render } from '@react-email/render';
import ESummitMail from '@/lib/emails/esummit-mail';
import React from 'react';

export default async function PreviewPage() {
    const html = await render(
        <ESummitMail
            userName="Fellow Innovator"
            subject="🚀 E-Summit '26 - Your Ultimate Guide!"
        />
    );

    return (
        <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
            <iframe
                srcDoc={html}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block'
                }}
                title="Email Preview"
            />
        </div>
    );
}
