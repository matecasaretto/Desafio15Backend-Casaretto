import mailer from "nodemailer";
import { config } from "../config/config.js";

export default class MaillingService {
    constructor() {
        this.client = mailer.createTransport({
            service: config.mailing.SERVICE,
            port: 587,
            auth: {
                user: config.mailing.USER,
                pass: config.mailing.PASSWORD
            }
        });
    }

    async sendSimpleMail(from, to, subject, html, attachments = []) {
        const result = await this.client.sendMail({
            from,
            to,
            subject,
            html,
            attachments
        });
        console.log(result);
        return result;
    }
}

export const sendRecoveryPass = async (userEmail, token) => {
    const link = `http://localhost:8096/reset-password?token=${token}`; // Corregí el error de escritura en "localhost"
    try {
        const maillingService = new MaillingService(); // Crea una instancia de tu servicio de correo electrónico
        await maillingService.sendSimpleMail(
            config.mailing.USER, // Corregí el campo "from" para que sea la dirección de correo del remitente
            userEmail,
            "Reestablecer Contraseña",
            `
            <div>
                <h2>Has solicitado un cambio de contraseña</h2>
                <p>Da clic en el siguiente enlace para restablecer la contraseña</p>
                <br/>
                <a href="${link}">
                    <button> Restablecer contraseña </button>
                </a>
            </div>
            `
        );
        console.log("Correo enviado correctamente");
    } catch (error) {
        console.log("Error al enviar el correo:", error.message);
        throw error; // Puedes manejar el error según sea necesario
    }
}
