const mongoose = require("mongoose");
const Project = mongoose.model("project");
const Task = mongoose.model("task");
const User = mongoose.model("user");
const { updateUserProject } = require("../controller/user.controller");
const _ = require("lodash");

exports.getOwnProjects = async function (req, res) {
  try {
    const project = await Project.find({ owner: req.userId })
      .select("-tasks")
      .select("-members")
      .sort("-createAt")
      .exec();
    res.json({ success: true, ownprojects: project });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, note: "Internal server error" });
  }
};

exports.getGuessProjects = async function (req, res) {
  try {
    const project = await Project.find({ members: req.userId })
      .select("-tasks")
      .select("-members")
      .sort("-createAt")
      .exec();
    res.json({ success: true, guessprojects: project });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, note: "Internal server error" });
  }
};

exports.getProject = async function (req, res) {
  try {
    const project = await Project.findOne({ _id: req.params.projectId })
      .populate("members", "username")
      .populate("owner", "username")
      .exec();
    res.json({ success: true, project: project });
  } catch (err) {
    console.log(err);
    res.json({ success: false, note: "Internal server error" });
  }
};

exports.createProject = async function (req, res) {
  const { projectName } = req.body;
  if (!projectName)
    return res.json({ status: false, note: "Missing project name" });
  const newProject = new Project({
    projectName: projectName,
    owner: req.userId,
  });
  try {
    const project = await newProject.save();
    await updateUserProject(req.userId, project._id);
    res.json({
      success: true,
      note: "Thêm dự án thành công",
      project: project,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, note: "Internal server error" });
  }
};

exports.updateProject = async function (req, res) {
  const { projectName } = req.body;
  try {
    const updated = await Project.findOneAndUpdate(
      { _id: req.params.projectId },
      { projectName: projectName },
      { new: true }
    );
    const result = await Project.findOne({ _id: updated._id })
      .populate("members", "username")
      .populate("owner", "username");
    res.json({ success: true, project: result });
  } catch (err) {
    console.log(err);
    res.json({ success: false, note: "Internal server error" });
  }
};

exports.deleteProject = async function (req, res) {
  try {
    const project = await Project.findOne({ _id: req.params.projectId });
    if (!project) {
      return res.status(401).json({ success: false, note: "Project not found" });
    }
    const removed = await Project.deleteOne({ _id: project._id });
    await Task.deleteMany({ _id: { $in: project.tasks } });
    res.json({ success: true, note: "Xóa thành công", project: removed });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, note: "Internal server error" });
  }
};

exports.updateMember = async function (req, res) {
  try {
    let members = req.body.members;
    members = members.filter(function (member, pos) {
      return members.indexOf(member) == pos;
    });
    const membersId = await User.find({ username: { $in: members } }, "_id");
    const project = await Project.findOne({ _id: req.params.projectId });
    if (!project) {
      return res.json({ success: false, note: "Project not found" });
    }
    project.members = [];
    await membersId.forEach(function (member) {
      if (_.isEqual(member._id, project.owner)) return;
      project.members.push(member._id);
    });
    const updated = await project.save();
    await membersId.forEach(async function (member) {
      updateUserProject(member._id, updated._id);
    });
    const result = await Project.findOne({ _id: updated._id })
      .populate("members", "username")
      .populate("owner", "username");
    res.json({
      success: true,
      note: "Thành viên đã được cập nhật",
      project: result,
    });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, note: "Internal server error" });
  }
};
