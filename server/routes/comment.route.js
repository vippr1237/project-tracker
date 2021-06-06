const commentCtrl = require("../controller/comment.controller");
const { requiresLogin } = require("../controller/user.controller");
module.exports = function (app) {
  app
    .route("/api/comments/:taskId")
    .get(requiresLogin, commentCtrl.getComments)
    .post(requiresLogin, commentCtrl.createComment);

  app
    .route("/api/comment/:commentId")
    .put(requiresLogin, commentCtrl.editComment)
    .delete(requiresLogin, commentCtrl.deleteComment);
};
