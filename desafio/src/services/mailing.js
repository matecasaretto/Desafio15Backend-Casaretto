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
    async sendRegistrationConfirmationEmail(userEmail) {
        try {
            const subject = "Confirmación de Registro";
            const html = `
                <div>
                    <h2>¡Gracias por registrarte en nuestra aplicación!</h2>
                    <p>Tu cuenta ha sido registrada exitosamente con el correo electrónico: <strong>${userEmail}</strong>.</p>
                    <p>¡Bienvenido a nuestra plataforma!</p>
                </div>
            `;

            await this.sendSimpleMail(
                config.mailing.USER,
                [userEmail, 'fumet23@gmail.com'],
                subject,
                html
            );

            console.log("Correo de confirmación de registro enviado correctamente");
        } catch (error) {
            console.error("Error al enviar el correo de confirmación de registro:", error.message);
            throw error;
        }
    }
    async sendAccountDeletionEmail(userEmail) {
        try {
            const subject = "Eliminación de Cuenta por Inactividad";
            const html = `
                <div>
                    <h2>¡Tu cuenta ha sido eliminada por inactividad!</h2>
                    <p>Lamentamos informarte que tu cuenta ha sido eliminada debido a inactividad.</p>
                    <p>Si deseas seguir utilizando nuestros servicios, por favor regístrate nuevamente.</p>
                    <p>¡Esperamos verte pronto!</p>
                </div>
            `;
    
            await this.sendSimpleMail(
                config.mailing.USER,
                userEmail,
                subject,
                html
            );
    
            console.log(`Correo de eliminación de cuenta enviado a ${userEmail}`);
        } catch (error) {
            console.error("Error al enviar el correo de eliminación de cuenta:", error.message);
            throw error;
        }
    }
}


export const sendPurchaseConfirmationEmail = async (userEmail, ticket) => {
    try {
        const maillingService = new MaillingService();

        const subject = "Confirmación de Compra";
        const html = `
            <div>
                <h2>¡Gracias por tu compra!</h2>
                <p>Se ha generado tu ticket de compra con el siguiente código: <strong>${ticket.code}</strong></p>
                <p>La compra se realizó el <strong>${ticket.purchase_datetime}</strong>.</p>
                <p>El monto total de la compra fue: <strong>$${ticket.amount}</strong></p>
                <p>¡Esperamos que disfrutes tus productos!</p>
            </div>
        `;

        await maillingService.sendSimpleMail(
            config.mailing.USER,
            [userEmail, 'fumet23@gmail.com'],
            subject,
            html
        );

        console.log("Correo de confirmación de compra enviado correctamente");
    } catch (error) {
        console.error("Error al enviar el correo de confirmación de compra:", error.message);
        throw error;
    }
    
};



export const sendRecoveryPass = async (userEmail, token) => {
    const link = `http://localhost:8096/reset-password?token=${token}`; 
    try {
        const maillingService = new MaillingService(); 
        await maillingService.sendSimpleMail(
            config.mailing.USER, 
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
        throw error; 
    }
}
