import sgMail from '@sendgrid/mail';
import { SendEmailProps } from '@types';

const sendEmail = async ({ to, subject, html }: SendEmailProps) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  const msg = {
    to,
    from: {
      email: 'abdulsalamquadri999@gmail.com',
      name: 'Olasunkanmi from ElectroMart'
    } ,
    subject,
    html
  };
  const info = await sgMail.send(msg);

  return info;
}

export default sendEmail