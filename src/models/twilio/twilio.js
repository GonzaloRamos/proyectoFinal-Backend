const twilio = require("twilio");
const {twilioConfig} = require("../../config/config.index");

const client = twilio(twilioConfig.accountSid, twilioConfig.authToken);

module.exports = client;
