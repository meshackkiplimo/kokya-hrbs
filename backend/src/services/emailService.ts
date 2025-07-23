import { sendEmail } from "../config/emailConfig";


class EmailService {
    async sendVerificationCode(email: string, code: string) {
        const subject = 'Email Verification';
        const message = `Your verification code is: ${code}`;
        const html = `
            <h1>Email Verification</h1>
            <p>Your verification code is: <strong>${code}</strong></p>
            <p>This code will expire in 3 hours.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
        `;

        return await sendEmail(email, subject, message, html);
    }
}

export const emailService = new EmailService();