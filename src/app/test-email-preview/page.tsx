import { render } from '@react-email/render';
import EventReminderEmail from '@/lib/emails/event-reminder';
import React from 'react';

export default async function PreviewPage() {
    const html = await render(
        <EventReminderEmail
            userName="Preview User"
            message="This is a preview of the custom message that you can include in the email."
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
