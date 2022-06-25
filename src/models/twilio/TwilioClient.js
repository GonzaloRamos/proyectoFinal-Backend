const twilio = require("twilio");
const {twilioConfig} = require("../../config/config.index");

/**
 * Clase que representa un cliente de twilio.
 * @class TwilioClient
 * @property {Object} client - Cliente de twilio
 * @property {String} body - Cuerpo del mensaje
 * @property {String} to - Numero de telefono del destinatario
 * @property {String} from - Numero de telefono del remitente. Por default tomara el numero de twilio configurado.+
 * @property {Array} mediaUrl - Array de urls de archivos multimedia
 */
class TwilioClient {
  #body;
  #mediaUrl;
  #from = twilioConfig.twilioPhone;
  #to;
  #client;
  constructor() {
    this.#client = twilio(twilioConfig.accountSid, twilioConfig.authToken);
  }

  /**
   * Este metodo envia una funcion mediante twilio. La funcion se ejecuta en una promesa y require que se setee los parámetros setTo() setUserEmail(), setMediaUrl().
   * @returns The message object.
   */
  async sendMessage() {
    try {
      const message = await this.#client.messages.create({
        body: this.#body,
        mediaUrl: this.#mediaUrl,
        from: `whatsapp:${this.#from}`,
        to: `whatsapp:+549${this.#to}`,
      });
      return message;
    } catch (error) {
      console.log(error);
    }
  }

  setBody(body) {
    this.#body = body;
  }

  setMediaUrl(mediaUrl) {
    if (Array.isArray(mediaUrl)) {
      this.#mediaUrl = mediaUrl;
    }
    {
      this.#mediaUrl = [];
    }
  }

  setFrom(from) {
    this.#from = from;
  }

  setTo(to) {
    this.#to = to;
  }
}

module.exports = TwilioClient;
