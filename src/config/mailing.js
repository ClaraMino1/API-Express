import nodemailer from "nodemailer";
import { env } from "./env.js";

export const transport = nodemailer.createTransport({
    service: env.MAILING_SERVICE,
    port: env.MAILING_PORT,
    auth: {
        user: env.MAILING_ACCOUNT,
        pass: env.MAILING_PASS
    }
})

export async function welcome(mail) {
    await transport.sendMail({
        from: "claraa.mino12@gmail.com",
        to: mail,
        subject: "BIENVENIDO",
        html: `
        <h1>BIENVENIDO! </h1>
        <p> gracias por registrarte </p>
    `
    });
}