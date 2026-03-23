import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email: string, code: string) {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
        console.error('CRITICAL: GMAIL_USER or GMAIL_APP_PASSWORD is missing from environment variables.');
        return { success: false, error: 'Internal configuration error' };
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user,
            pass,
        },
    });

    try {
        console.log(`[Email] Attempting to send code to: ${email} via Gmail SMTP`);

        const mailOptions = {
            from: `"The Literary Atelier" <${user}>`,
            to: email,
            subject: 'Verify your provenance | The Literary Atelier',
            html: `
                <div style="font-family: 'Manrope', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fbf9f4; padding: 48px 32px; color: #1b1c19;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <h1 style="font-family: 'Noto Serif', Georgia, serif; font-size: 28px; font-weight: 300; color: #03192e; margin: 0; letter-spacing: -0.02em;">The Literary Atelier</h1>
                        <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.25em; color: #5f5e5e; margin-top: 8px;">Curating the written word</p>
                    </div>
                    
                    <div style="background-color: #ffffff; padding: 40px; border: 1px solid #e4e2dd; border-radius: 4px; box-shadow: 0 10px 25px rgba(27, 28, 25, 0.03);">
                        <p style="font-family: 'Noto Serif', Georgia, serif; font-size: 18px; color: #03192e; margin-top: 0; margin-bottom: 24px; font-style: italic;">Confirm your identity.</p>
                        
                        <p style="font-size: 14px; line-height: 1.6; color: #5f5e5e; margin-bottom: 32px;">
                            Please enter the following dispatch code to verify your records and secure your archival access.
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #03192e 0%, #1a2e44 100%); color: #ffffff; padding: 32px 24px; font-family: 'Noto Serif', Georgia, serif; font-size: 36px; letter-spacing: 0.4em; text-align: center; margin-bottom: 32px; border-radius: 4px; box-shadow: 0 15px 35px -5px rgba(3, 25, 46, 0.2);">
                            ${code}
                        </div>
                        
                        <div style="border-top: 1px solid #e4e2dd; padding-top: 24px;">
                            <p style="font-size: 11px; color: #74777d; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Security Notice</p>
                            <p style="font-size: 12px; line-height: 1.5; color: #74777d; margin: 0; font-style: italic;">
                                This temporal key expires in 10 minutes. If this request was not initiated by you, please disregard this transmission securely.
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 40px;">
                        <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: #c4c6cd; margin: 0;">Est. 2024 &mdash; London / Paris / New York</p>
                    </div>
                </div>
            `,
        };

        const result = await transporter.sendMail(mailOptions);

        console.log('Gmail SMTP Success. Message ID:', result.messageId);
        return { success: true, data: result };
    } catch (error) {
        console.error('Failed to send verification email (Caught Exception):', error);
        return { success: false, error };
    }
}
