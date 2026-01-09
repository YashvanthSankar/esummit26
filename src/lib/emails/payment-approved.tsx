import * as React from 'react';

interface PaymentApprovedEmailProps {
    userName: string;
    ticketType: string;
    amount: number;
}

export const PaymentApprovedEmail: React.FC<PaymentApprovedEmailProps> = ({
    userName,
    ticketType,
    amount,
}) => (
    <html>
        <head>
            <style>{`
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background-color: #050505;
                    color: #ffffff;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .logo {
                    font-size: 32px;
                    font-weight: 800;
                    background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 8px;
                }
                .subtitle {
                    color: #666666;
                    font-size: 14px;
                }
                .card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 32px;
                    margin-bottom: 24px;
                }
                .success-badge {
                    display: inline-block;
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    color: #10b981;
                    padding: 8px 16px;
                    border-radius: 999px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    margin-bottom: 24px;
                }
                h1 {
                    font-size: 28px;
                    margin: 0 0 16px 0;
                    font-weight: 700;
                }
                .greeting {
                    color: #a855f7;
                    margin-bottom: 8px;
                }
                p {
                    line-height: 1.6;
                    color: #cccccc;
                    margin: 0 0 16px 0;
                }
                .ticket-details {
                    background: rgba(168, 85, 247, 0.05);
                    border-left: 4px solid #a855f7;
                    padding: 20px;
                    margin: 24px 0;
                    border-radius: 8px;
                }
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                }
                .detail-label {
                    color: #999999;
                    font-size: 14px;
                }
                .detail-value {
                    color: #ffffff;
                    font-weight: 600;
                    font-size: 14px;
                }
                .cta-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
                    color: #ffffff;
                    padding: 16px 32px;
                    border-radius: 12px;
                    text-decoration: none;
                    font-weight: 600;
                    margin: 24px 0;
                }
                .footer {
                    text-align: center;
                    color: #666666;
                    font-size: 12px;
                    margin-top: 40px;
                    padding-top: 24px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </head>
        <body>
            <div className="container">
                <div className="header">
                    <div className="logo">E-SUMMIT '26</div>
                    <div className="subtitle">IIITDM Kancheepuram</div>
                </div>

                <div className="card">
                    <div className="success-badge">✓ Payment Approved</div>

                    <h1>
                        <div className="greeting">Hey {userName}! 👋</div>
                        Your Payment is Confirmed
                    </h1>

                    <p>
                        Great news! Your payment has been verified and approved by our team.
                        Your ticket is now ready to download.
                    </p>

                    <div className="ticket-details">
                        <div className="detail-row">
                            <span className="detail-label">Ticket Type</span>
                            <span className="detail-value">{ticketType.toUpperCase()}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Amount Paid</span>
                            <span className="detail-value">₹{amount}</span>
                        </div>
                    </div>

                    <p>
                        <strong>Next Steps:</strong>
                    </p>
                    <ol style={{ color: '#cccccc', lineHeight: '1.8' }}>
                        <li>Visit your dashboard to download your ticket</li>
                        <li>Save the QR code - you'll need it for entry</li>
                        <li>Mark your calendar for the event dates</li>
                    </ol>

                    <center>
                        <a href="https://esummit.iiitdm.ac.in/dashboard" className="cta-button">
                            Download Your Ticket →
                        </a>
                    </center>
                </div>

                <div className="footer">
                    <p>
                        Questions? Contact us at support@esummit.iiitdm.ac.in
                    </p>
                    <p style={{ marginTop: '8px' }}>
                        © 2026 E-Cell IIITDM Kancheepuram. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
    </html>
);

export default PaymentApprovedEmail;
