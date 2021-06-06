const mongoose = require("mongoose");
const Comment = mongoose.model("comment");
const Task = mongoose.model("task");
const Project = mongoose.model("project");
const _ = require("lodash");

exports.getComments = async function (req, res) {
  Comment.find({ task: req.params.taskId })
    .populate("user", "username")
    .sort("createAt")
    .exec(function (err, comments) {
      if (err) {
        console.log(err);
        return res.json({ success: false, note: "Comment not found" });
      }
      res.json({ success: true, comments: comments });
    });
};

exports.createComment = async function (req, res) {
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
    if (project.owner !== req.userId)
      return res.json({ success: false, note: "You cannot access this route" });
  }
  //All good
  const newComment = new Comment({
    body: body,
    user: req.userId,
    task: req.params.taskId,
  });
  newComment.save(function (err, comment) {
    if (err) {
      console.log(err);
      res.json({ success: false, note: "Internal server error" });
    }
    Task.findOneAndUpdate(
      { _id: comment.task },
      { $push: { comments: comment._id } },
      function (err) {
        if (err) {
          console.log(err);
          res.json({ success: false, note: "Internal server error" });
        }
      }
    );
    res.json({ success: true, comment: comment });
  });
};

exports.editComment = function (req, res) {
  const { body } = req.body;
  if (!body) {
    return res.json({ success: false, note: "Missing body" });
  }
  Comment.findOne({ _id: req.params.commentId }, async function (err, comment) {
    if (err) return res.json({ success: false, note: "Comment not found" });
    if (!comment) {
      return res.json({ success: false, note: "Comment not found" });
    }
    comment.body = body;
    const result = await comment.save();
    res.json({ success: true, comment: result });
  });
};

exports.deleteComment = async function (req, res) {
  Comment.findOne({ _id: req.params.commentId }, async function (err, comment) {
    if (err) {
      console.log(err);
      res.json({ success: false, note: "Internal server error" });
    }
    try {
      const removed = await Comment.deleteOne({ _id: comment._id });
      Task.findOne({ _id: comment.task }, async function (err, task) {
        if (err) {
          console.log(err);
          return res.json({ success: false, note: "Task not found" });
        }
        task.comments.splice(task.comments.indexOf(comment._id), 1);
        task.save();
      });
      res.json({ success: true, comment: removed });
    } catch (err) {
      console.log(err);
      res.json({ success: false, note: "Internal server error" });
    }
  });
};
