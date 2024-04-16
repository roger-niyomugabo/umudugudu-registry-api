import nodemailer from 'nodemailer';
import config from '../config';
import { EmailInfo } from '../interfaces';
import { accountCreationTemplate, residentRegistrationTemplate } from './emailTemplates';

const mailer = async (info: EmailInfo, action: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.NODEMAILER.API_SENDER_EMAIL,
            pass: config.NODEMAILER.EMAIL_PASSWORD,
        },
    });

    let subject: string;
    let emailto: string;
    let data: string;
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (action) {
        case 'accountCreationRequest':
            subject = 'Account creation';
            data = accountCreationTemplate(info);
            emailto = info.email;
            break;
        case 'residentRegistrationRequest':
            subject = 'Account creation';
            data = residentRegistrationTemplate(info);
            emailto = info.email;
            break;

        default:
            subject = '';
            break;
    }
    const mailOptions = {
        from: 'Visit Record Keeping ',
        to: emailto,
        subject,
        html: data,
    };
    try {
        return transporter.sendMail(mailOptions);
    } catch (error) {
        return error;
    }
};
export default mailer;
