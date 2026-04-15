import nodemailer from "nodemailer";
import { ServiceError } from "./errors.js";

const port = Number(process.env.EMAIL_SMTP_PORT);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST,
  port,
  secure: port === 465,
  auth: {
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PASSWORD,
  },
});

async function send(mailOptions) {
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new ServiceError({
      message: "Não foi possível enviar o email",
      action: "Verifique se o serviço de email está disponível",
      cause: error,
      context: {
        ...mailOptions,
        // opcional: remover campos sensíveis se houver
      },
    });
  }
}

const email = {
  send,
};

export default email;