require("dotenv").config();

//loggers config.
const {
  logger,
  consoleLogger,
  infoLogger,
  errorLogger,
  warnLogger,
} = require("./logger/log4js.config");
//Node mailer config.
const mailerConfig = require("./node_mailer/nodeMailer.config");

//Server config
const SERVER = require("./server/server.config");

//Mongo DB config
const mongoDB = require("./db/mongo/mongoDB.config");

//Twilio client config
const twilioConfig = require("./twilio_client/twilio.config");

module.exports = {
  mongoDB,
  DATABASE_TO_USE: process.env.DATABASE_TO_USE,
  mailerConfig,
  twilioConfig,
  log4js: {
    logger,
    consoleLogger,
    infoLogger,
    warnLogger,
    errorLogger,
  },
  SERVER,
};
