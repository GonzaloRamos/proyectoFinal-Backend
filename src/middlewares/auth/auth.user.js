function apiAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({error: "¡No autorizado! Debe estar autenticado."});
  }
}

module.exports = apiAuth;
