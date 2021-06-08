const controller = require("../controller/admin.controller");
const { requiresLogin } = require("../controller/user.controller");

module.exports = function (app) {
  app.route("/api/admin").get(requiresLogin, controller.statistic);
};
