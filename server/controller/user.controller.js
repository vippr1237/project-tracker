const mongoose = require("mongoose");
const User = mongoose.model("user");
const Project = mongoose.model("project");
const _ = require("lodash");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signUp = async function (req, res) {
  const { username, password, email } = req.body;
  //validate
  if (!username || !password || !email) {
    return res.status(400).json({
      success: false,
      note: "Missing username or password or email",
    });
  }
  //check email
  const emailExists = await User.findOne({ email: email });
  if (emailExists)
    return res.status(400).json({ success: false, note: "Email đã tồn tại!" });
  //check username
  const usernameExists = await User.findOne({ username: username });
  if (usernameExists)
    return res
      .status(400)
      .json({ success: false, note: "Username đã tồn tại!" });
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username: username,
    password: hashPassword,
    email: email,
  });
  try {
    const result = await newUser.save();
    res.json({ success: true, note: "Đăng kí thành công" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.signIn = async function (req, res) {
  const { username, password } = req.body;
  //validate
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, note: "Missing username or password" });
  try {
    const user = await User.findOne({ username: username });
    if (!user)
      return res
        .status(400)
        .json({ success: false, note: "Sai tên người dung" });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ success: false, note: "Sai mật khẩu" });

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

    res.json({ success: true, note: "Logged in!", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.requiresLogin = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(400).json({ success: false, note: "Token not found" });
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userId = verified._id;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, note: "Invalid token" });
  }
};

exports.updateUserTask = async function (userId, item) {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return new Error("User not found");
    }
    if (user.task.includes(item)) return;
    await user.task.push(item);
    return await user.save();
  } catch (err) {
    console.log(err);
    return err;
  }
};

exports.updateUserProject = async function (userId, item) {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return new Error("User not found");
    }
    if (user.project.includes(item)) return;
    await user.project.push(item);
    return await user.save();
  } catch (err) {
    console.log(err);
    return err;
  }
};

exports.authorize = async function (req, res, next) {
  try {
    if (req.params.projectId) {
      const project = await Project.findOne({ _id: req.params.projectId });
      if (!project) {
        return res.status(400).send("Project not found");
      }
      if (project.owner == req.userId || project.members.includes(req.userId)) {
        next();
      } else {
        return res.status(403).send("You can not access this route");
      }
    } else if (req.params.taskId) {
      const project = await Project.findOne({ tasks: req.params.taskId });
      if (!project) {
        return res.status(400).send("Project not found");
      }
      if (project.owner == req.userId || project.members.includes(req.userId)) {
        next();
      } else {
        return res.status(403).send("You can not access this route");
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};

exports.isOwner = async function (req, res, next) {
  try {
    if (req.params.projectId) {
      const project = await Project.findOne({ _id: req.params.projectId });
      if (!project) {
        return res.status(400).send("Project not found");
      }
      if (project.owner == req.userId) {
        next();
      } else {
        return res.status(403).send("You can not access this route");
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};

exports.auth = async function (req, res) {
  try {
    const user = await User.findOne({ _id: req.userId }).select("-password");
    if (!user) {
      return res.status(400).json({ success: false, note: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, note: "Internal server error" });
  }
};
