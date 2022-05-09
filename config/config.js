// configuración de log4js

const log4js = require("log4js");
const path = require("path");
const cwd = process.cwd();

/**
 * Dos grandes grupos.
 * Apendices donde queremos almacenar nuestro logs
 *
 * CATEGORIAS
 * Como podemos clasificar nuestros logs y dividirlos como tal.
 */

log4js.configure({
  appenders: {
    console: {type: "console" /**indica que va directo a la consola */},
    infoFile: {
      type: "file",
      filename: path.join(cwd, "/log/info.log") /**nombre del archivo */,
      maxLogSize: 10485760,
    },
    warningFile: {type: "file", filename: path.join(cwd, "/log/warn.log")},
    errorsFile: {type: "file", filename: path.join(cwd, "/log/error.log")},
  },
  categories: {
    /**cuando no se elija ninguna categoria en especial
     * Solo funciona el nivel error en default */
    default: {
      appenders: ["console"],
      level: "trace" /**Niveles warn, info, error debug, trace, fatal */,
    },
    console: {
      appenders: ["console"],
      level: "debug",
    },
    infoFile: {
      appenders: ["infoFile", "console"],
      level: "info",
    },
    warningFile: {
      appenders: ["warningFile"],
      level: "warn",
    },
    errorsFile: {
      appenders: ["errorsFile"],
      level: "error",
    },
  },
});

const logger = log4js.getLogger();
const consoleLogger = log4js.getLogger("console");
const infoLogger = log4js.getLogger("infoFile");
const warnLogger = log4js.getLogger("warningFile");
const errorLogger = log4js.getLogger("errorsFile");

module.exports = {
  mongoDB: {
    uri: `mongodb+srv://gonzalo:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.1bu3e.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
  },
  DATABASE_TO_USE: process.env.DATABASE_TO_USE,
  mailerConfig: {
    transport: {
      service: process.env.MAIL_SERVICE,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    },
  },
  twilioConfig: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
  },
  log4js: {
    logger,
    consoleLogger,
    infoLogger,
    warnLogger,
    errorLogger,
  },
  SERVER: {
    PORT: process.env.PORT || 8080,
    MODE: process.env.SERVER_MODE || "fork",
  },
};
