const apiAuth = require("../../middlewares/auth/auth.user");

const indexApiRoutes = require("express").Router();

indexApiRoutes.use("/api/carrito", require("./carrito/carrito.routes"));
indexApiRoutes.use("/api/productos", require("./productos/public/public.routes"));
indexApiRoutes.use(
  "/api/productos",
  apiAuth,
  require("./productos/private/private.routes")
);
indexApiRoutes.use("/api/user", require("./user/user.routes"));

module.exports = indexApiRoutes;
