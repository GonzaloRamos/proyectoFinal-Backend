const {createTransport} = require("nodemailer");
const {mailerConfig} = require("../../config/config.index");

/**
 * Clase que representa un cliente de nodemailer.
 * @class NodeMailerClient
 * @property {Object} transporter - Cliente de nodemailer
 * @property {String} subject - Asunto del mensaje
 * @property {String} html - Cuerpo del mensaje
 * @property {String} to - Mail del destinatario. Por default tomara el mail de la variable de entorno MAIL_ADMIN
 * @property {String} from - Mail del remitente. Por default toma el string "Node JS Server".
 */
class NodeMailerClient {
  #from = "Node JS Server";
  #to = process.env.MAIL_ADMIN;
  #subject;
  #html;
  #transporter;
  constructor() {
    this.#transporter = createTransport(mailerConfig.transport);
  }

  async sendMail() {
    try {
      const info = await this.#transporter.sendMail({
        from: this.#from,
        to: this.#to,
        subject: this.#subject,
        html: this.#html,
      });
      return info;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  setFrom(from) {
    this.#from = from;
  }

  setTo(to) {
    this.#to = to;
  }

  setSubject(subject) {
    this.#subject = subject;
  }

  setHtml(html) {
    this.#html = html;
  }
}
module.exports = NodeMailerClient;
