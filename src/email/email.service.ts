import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });
    }

    async sendResetPasswordEmail(email: string, resetToken: string) {
        const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Reset Your Password',
            html: `
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
            `,
        };

        await this.transporter.sendMail(mailOptions);
    }
}
