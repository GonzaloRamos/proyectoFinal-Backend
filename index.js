require("dotenv").config();
const express = require("express");
const router = require("./routes/index.routes.js");
const passport = require("./middlewares/auth/passport.local");
const app = express();
const server = require("http").createServer(app);
const MongoStore = require("connect-mongo");
const session = require("express-session");
const {mongoDB, log4js, SERVER} = require("./config/config.js");

//import clusters
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(
  session({
    store: MongoStore.create({mongoUrl: mongoDB.uri}),
    secret: "login",
    saveUninitialized: false,
    resave: false,
    rollin0g: true,
    // cookie: {
    //   maxAge: 100000,
    // },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(router);

if (SERVER.MODE === "cluster") {
  if (cluster.isPrimary) {
    log4js.consoleLogger.info(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      log4js.consoleLogger.info(`worker ${worker.process.pid} died`);
    });
  } else {
    server.listen(SERVER.PORT, () => {
      log4js.consoleLogger.info(`Server running on port ${SERVER.PORT}`);
    });
  }
} else {
  server.listen(SERVER.PORT, () => {
    log4js.consoleLogger.info(`Server running on port ${SERVER.PORT}`);
  });
}
