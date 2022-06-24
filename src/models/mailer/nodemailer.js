const {createTransport} = require("nodemailer");
const {mailerConfig} = require("../../config/config.index");
const transporter = createTransport(mailerConfig.transport);
module.exports = transporter;
