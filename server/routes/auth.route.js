const controller = require("../controller/user.controller");

module.exports = function (app) {
  app.route("/api/login").post(controller.signIn);

  app.route("/api/register").post(controller.signUp);
  app.route("/api/auth").get(controller.requiresLogin, controller.auth);
};
