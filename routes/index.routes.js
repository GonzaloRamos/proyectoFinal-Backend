//Main Router
const express = require("express");
const {log4js} = require("../config/config");

const router = express.Router();

//Import de routers
const indexApiRoutes = require("./api/indexApi.routes");
const pagesRoutes = require("./pages/pages.routes.js");

//config middlewares
router.use(express.json());
router.use(express.urlencoded({extended: true}));

//Rutas pages
router.use(pagesRoutes);

//Rutas Api
router.use(indexApiRoutes);

//Catch rutas no existentes. Error 404 (Render de página)
router.use("*", (req, res) => {
  const errorObject = {
    error: -2,
    descripcion: `La ruta ${req.url} con el metodo ${req.method} no esta implementado`,
  };
  log4js.warnLogger.warn(errorObject);
  res.status(404).json(errorObject);
});

module.exports = router;
