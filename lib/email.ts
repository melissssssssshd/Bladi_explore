import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  // Créer un transporteur SMTP avec Mailtrap
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "ea8d4a05cc46cf",
      pass: "9ef3e96772733f",
    },
  });

  // Envoyer l'email
  await transporter.sendMail({
    from: '"Bladi Tourisme" <noreply@bladi-tourisme.com>',
    to,
    subject,
    html,
  });
}
