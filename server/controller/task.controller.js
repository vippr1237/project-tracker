const mongoose = require("mongoose");
const Task = mongoose.model("task");
const Project = mongoose.model("project");
const User = mongoose.model("user");
const _ = require("lodash");
const moment = require("moment");
const { updateUserTask } = require("../controller/user.controller");

exports.addTask = async function (req, res) {
  try {
    const { taskName, assignTo, dateDue } = req.body;
    let deadline = null;
    if (!taskName) {
      return res.status(400).json({ success: false, note: "Missing task name" });
    }
    if (dateDue) {
      deadline = moment(new Date(dateDue), "MM-DD-YYYY");
    }
    const newTask = new Task({
      taskName: taskName,
      project: req.params.projectId,
      dateDue: deadline,
      assignBy: req.userId,
    });
    if (assignTo.length) {
      const assignToId = await User.find({ username: { $in: assignTo } }, "_id");
      const project = await Project.findOne({ _id: req.params.projectId });
      const validMember = [...project.members, project.owner];
      const validate = assignToId.every(function (member) {
        return _.some(validMember, member._id);
      });
      if (!validate) {
        return res.json({
          status: false,
          note: "Không tìm thấy thành viên",
        });
      }
      await assignToId.forEach(function (member) {
        newTask.assignTo.push(member._id);
      });
    }

    const task = await newTask.save();
    await Project.findOneAndUpdate(
      { _id: req.params.projectId },
      { $push: { tasks: task } }
    );
    task.assignTo.forEach((member) => {
      updateUserTask(member, task._id);
    });
    res.json({
      success: true,
      note: "Thêm công việc thành công",
      task: task,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, note: "Internal server error" });
  }
};

exports.getTasks = async function (req, res) {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignTo", "username")
      .populate("assignBy", "username")
      .sort({ status: 1, createAt: -1 })
      .exec();
    res.json({ success: true, tasks: tasks });
  } catch (err) {
    console.log(err);
    res.json({ success: false, note: "Internal server error" });
  }
};

exports.getTask = async function (req, res) {
  try {
    const task = await Task.findOne({ _id: req.params.taskId })
      .populate("assignTo", "username")
      .exec();
    res.json({ success: true, task: task });
  } catch (err) {
    console.log(err);
    res.json({ success: false, note: "Internal server error" });
  }
};

exports.updateTask = async function (req, res) {
  try {
    const { taskName, assignTo, dateDue, list, status } = req.body;
    let deadline = null;
    if (!taskName) {
      return res.json({ success: false, note: "Missing task name" });
    }
    if (dateDue) {
      deadline = moment(new Date(dateDue), "MM-DD-YYYY");
    }
    const task = await Task.findOne({ _id: req.params.taskId });
    if (!task) {
      return res.json({ success: false, note: "Task not found" });
    }
    task.taskName = taskName;
    task.dateDue = deadline;
    task.status = status;
    if (list) {
      task.list = [];
      await list.forEach(function (item) {
        task.list.push(item);
      });
    }
    if (assignTo) {
      const assignToId = await User.find(
        { username: { $in: assignTo } },
        "_id"
      );
      const project = await Project.findOne({ _id: task.project });
      const validMember = [...project.members, project.owner];
      const validate = assignTo.every(function (member) {
        return _.some(validMember, member._id);
      });
      if (!validate) {
        return res.json({
          status: false,
          note: "Member not found or not belong to this project",
        });
      }
      task.assignTo = [];
      await assignToId.forEach(function (member) {
        task.assignTo.push(member._id);
      });
    }
    await task.save();
    task.assignTo.forEach((member) => {
      updateUserTask(member, task._id);
    });
    res.json({ success: true, note: "Cập nhật thành công", task: task });
  } catch (err) {
    console.log(err);
    res.json({ success: false, note: "Internal server error" });
  }
};

exports.deleteTask = async function (req, res) {
  try {
    const task = await Task.findOne({ _id: req.params.taskId });
    if (!task) {
      return res.status(500).send("Task not found");
    }
    const removed = await Task.deleteOne({ _id: task._id });
    const project = await Project.findOne({ _id: task.project });
    project.tasks.splice(project.tasks.indexOf(task._id), 1);
    await project.save();
    res.json({ success: true, note: "Xóa thành công", task: removed });
  } catch (err) {
    console.log(err);
    res.json({ success: false, note: "Internal server error" });
  }
};
