const controller = require('../controller/project.controller');
const {requiresLogin, authorize, isOwner} = require('../controller/user.controller')

module.exports = function (app) {
    app.route('/api/ownproject')
    .get(requiresLogin, controller.getOwnProjects)
    .post(requiresLogin, controller.createProject)

    app.route('/api/guessproject')
    .get(requiresLogin, controller.getGuessProjects)

    app.route('/api/project/:projectId')
    .get(requiresLogin, authorize, controller.getProject)
    .post(requiresLogin, authorize, controller.updateMember)
    .put(requiresLogin, authorize,controller.updateProject)
    .delete(requiresLogin, isOwner,controller.deleteProject)
}