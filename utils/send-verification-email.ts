import sendEmail from "./send-email.js"
import ejs from 'ejs'
import { SendVerificationEmailProps } from '@types';

const sendVerificationEmail = async ({name, email, verificationCode}: SendVerificationEmailProps) => {
    const homepage = process.env.CORSORIGIN;
    const firstName = name; 
    const code = verificationCode; 

    const template = await ejs.renderFile('views/verification-email.ejs', { homepage, firstName, code });

    return sendEmail({
        to: email,
        subject: 'Verify Your Email',
        html: template
    })
}

export default sendVerificationEmail