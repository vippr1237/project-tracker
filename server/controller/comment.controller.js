const mongoose = require("mongoose");
const Comment = mongoose.model("comment");
const Task = mongoose.model("task");
const Project = mongoose.model("project");
const _ = require("lodash");
const nodemailer = require("nodemailer");

exports.getComments = async function (req, res) {
  try {
    const comments = await Comment.find({ task: req.params.taskId })
      .populate("user", "username")
      .sort("-createAt")
      .exec();
    res.json({ success: true, comments: comments });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, note: "Comment not found" });
  }
};

exports.createComment = async function (req, res) {
  try {
    const { body } = req.body;
    if (!body) {
      return res.json({ success: false, note: "Missing body" });
    }
    const validate = await Task.findOne({ _id: req.params.taskId });
    if (!validate) {
      return res.json({ success: false, note: "Task does not exist" });
    }
    const project = await Project.findOne({ _id: validate.project });
    if (project.members.length) {
      const validMember = [...project.members, project.owner];
      const check = validMember.map((member) => member == req.userId);
      if (!check.includes(true))
        return res.json({ success: false, note: "You cannot access this route" });
    } else {
      if (project.owner != req.userId)
        return res.json({ success: false, note: "You cannot access this route" });
    }
    //All good
    const newComment = new Comment({
      body: body,
      user: req.userId,
      task: req.params.taskId,
    });
    const comment = await newComment.save();
    await Task.findOneAndUpdate(
      { _id: comment.task },
      { $push: { comments: comment._id } }
    );
    res.json({ success: true, comment: comment });

    const transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "7234eb77f9c39e",
        pass: "3f649abc93e926",
      },
    });

    const d = new Date();
    let time = d.toLocaleString();

    const options = {
      from: "quanly@coangha.io",
      to: "monitoring@coangha.io",
      subject: `Người dùng ${req.userId} đã comment vào ticket ${req.params.taskId}`,
      text: `Người dùng ${req.userId} đã comment "${body}" vào ticket ${req.params.taskId} lúc ${time}`,
    };

    transport.sendMail(options, function (err, info) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Sent: " + info.response);
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, note: "Internal server error" });
  }
};

exports.editComment = async function (req, res) {
  try {
    const { body } = req.body;
    if (!body) {
      return res.json({ success: false, note: "Missing body" });
    }
    const comment = await Comment.findOne({ _id: req.params.commentId });
    if (!comment) {
      return res.json({ success: false, note: "Comment not found" });
    }
    comment.body = body;
    const result = await comment.save();
    res.json({ success: true, comment: result });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, note: "Comment not found" });
  }
};

exports.deleteComment = async function (req, res) {
  try {
    const comment = await Comment.findOne({ _id: req.params.commentId });
    if (!comment) {
      return res.json({ success: false, note: "Comment not found" });
    }
    const removed = await Comment.deleteOne({ _id: comment._id });
    const task = await Task.findOne({ _id: comment.task });
    if (!task) {
      return res.json({ success: false, note: "Task not found" });
    }
    task.comments.splice(task.comments.indexOf(comment._id), 1);
    await task.save();
    res.json({ success: true, comment: removed });
  } catch (err) {
    console.log(err);
    res.json({ success: false, note: "Internal server error" });
  }
};
