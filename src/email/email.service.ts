import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './dto/email.dto';
import { TransportOptions } from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        } as TransportOptions);
    }

    async sendEmail(dto: SendEmailDto) {
        const { recipients, subject, html } = dto;

        const options: nodemailer.SendMailOptions = {
            from: process.env.EMAIL_USER,
            to: recipients,
            subject,
            html,
        };

        try {
            await this.transporter.sendMail(options);
        } catch (error) {
            throw new InternalServerErrorException('Failed to send email');
        }
    }
}
