const controller = require("../controller/task.controller");
const { requiresLogin, authorize } = require("../controller/user.controller");

module.exports = function (app) {
  app
    .route("/api/tasks/:projectId")
    .get(requiresLogin, controller.getTasks)
    .post(requiresLogin, controller.addTask);

  app
    .route("/api/task/:taskId")
    .get(requiresLogin, authorize, controller.getTask)
    .put(requiresLogin, authorize, controller.updateTask)
    .delete(requiresLogin, authorize, controller.deleteTask);
};
