import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';
configDotenv();

// Keep a fallback if no SMTP configured
export async function sendOtpEmail(email, otp, type) {
    const isReset = type === 'reset';
    const subject = isReset ? 'Serene: Reset Your Password' : 'Serene: Verify Your Email';
    const textbody = `Your OTP is: ${otp}. It will expire in 10 minutes.`;

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
        console.log(`\n========================================`);
        console.log(`===        MOCK EMAIL SENT           ===`);
        console.log(`========================================`);
        console.log(`To: ${email}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: \n${textbody}`);
        console.log(`========================================\n`);
        return true;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Serene Support" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
            to: email,
            subject,
            text: textbody,
        });
        
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}
