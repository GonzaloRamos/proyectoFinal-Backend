const {Router} = require("express");
const {
  indexController,
  adminPanelController,
  loginRegisterController,
} = require("../../controllers/pages/pages.controller");
const {apiAuth} = require("../../middlewares/auth/auth.user");

const router = Router();

router.get("/", indexController);

router.get("/login-register", loginRegisterController);

/**
 * Rutas para el panel de administracion.
 * El params :action es para saber que ruta se va a ejecutar.
 * En función de la accion se muestra un panel tanto para productos como para usuarios.
 */
router.get("/admin-panel/:action", apiAuth, adminPanelController);

module.exports = router;
