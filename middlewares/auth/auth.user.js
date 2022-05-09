// function webAuth(req, res, next) {
//   const isLogged = req.isAuthenticated();
//   if (isLogged) {
//     next();
//   }
// }

function apiAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({error: "no autorizado!"});
  }
}

module.exports = {apiAuth};
