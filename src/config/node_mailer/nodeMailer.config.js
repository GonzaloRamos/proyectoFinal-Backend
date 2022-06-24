const mailerConfig = {
  transport: {
    service: process.env.MAIL_SERVICE,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  },
};

module.exports = mailerConfig;
