const SERVER = {
  PORT: process.env.PORT || 8080,
  MODE: process.env.SERVER_MODE || "fork",
};

module.exports = SERVER;
