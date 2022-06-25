const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhone: process.env.TWILIO_PHONE,
};

module.exports = twilioConfig;
