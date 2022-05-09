const {createTransport} = require("nodemailer");
const {mailerConfig} = require("../config/config");
const transporter = createTransport(mailerConfig.transport);
module.exports = transporter;
