const mongoose = require("mongoose");
const Project = mongoose.model("project");
const Task = mongoose.model("task");
const User = mongoose.model("user");

exports.statistic = async function (req, res) {
  try {
    const projects = await Project.find({});
    const tasks = await Task.find({});
    const users = await User.find({});
    res.json({
      success: true,
      projects: projects.length,
      tasks: tasks.length,
      users: users.length,
    });
  } catch (err) {
    if (err)
      res.status(500).json({ success: false, note: "Internal Server Error" });
  }
};
