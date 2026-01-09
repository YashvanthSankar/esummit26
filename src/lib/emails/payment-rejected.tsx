import * as React from 'react';

interface PaymentRejectedEmailProps {
    userName: string;
    ticketType: string;
    amount: number;
}

export const PaymentRejectedEmail: React.FC<PaymentRejectedEmailProps> = ({
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
                .warning-badge {
                    display: inline-block;
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #ef4444;
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
                    color: #ef4444;
                    margin-bottom: 8px;
                }
                p {
                    line-height: 1.6;
                    color: #cccccc;
                    margin: 0 0 16px 0;
                }
                .info-box {
                    background: rgba(239, 68, 68, 0.05);
                    border-left: 4px solid #ef4444;
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
                    background: rgba(168, 85, 247, 0.1);
                    border: 2px solid #a855f7;
                    color: #a855f7;
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
                    <div className="warning-badge">⚠ Payment Not Verified</div>

                    <h1>
                        <div className="greeting">Hi {userName},</div>
                        We Couldn't Verify Your Payment
                    </h1>

                    <p>
                        Unfortunately, we were unable to verify your payment for the E-Summit '26 ticket.
                        This could be due to:
                    </p>

                    <ul style={{ color: '#cccccc', lineHeight: '1.8' }}>
                        <li>Incorrect UTR/Transaction ID</li>
                        <li>Payment screenshot not clear</li>
                        <li>Amount mismatch</li>
                        <li>Payment not received in our account</li>
                    </ul>

                    <div className="info-box">
                        <div className="detail-row">
                            <span className="detail-label">Ticket Type</span>
                            <span className="detail-value">{ticketType.toUpperCase()}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Expected Amount</span>
                            <span className="detail-value">₹{amount}</span>
                        </div>
                    </div>

                    <p>
                        <strong>What to do next:</strong>
                    </p>
                    <ol style={{ color: '#cccccc', lineHeight: '1.8' }}>
                        <li>Double-check your payment details</li>
                        <li>Contact our support team with your transaction details</li>
                        <li>We'll help resolve this as quickly as possible</li>
                    </ol>

                    <center>
                        <a href="mailto:support@esummit.iiitdm.ac.in" className="cta-button">
                            Contact Support →
                        </a>
                    </center>
                </div>

                <div className="footer">
                    <p>
                        <strong>Need Help?</strong> Email us at support@esummit.iiitdm.ac.in
                    </p>
                    <p style={{ marginTop: '8px' }}>
                        © 2026 E-Cell IIITDM Kancheepuram. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
    </html>
);

export default PaymentRejectedEmail;
