const express = require("express");
const path = require("path");
const config = require("./config");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

module.exports = () => {
  const app = express();
  //middleware
  app.use(express.json());
  app.use(cors());
  //dev middleware
  app.use(morgan("dev"));
  // glob model file
  config.getGlobbedFile("./server/models/**/*.js").forEach((modelPath) => {
    require(path.resolve(modelPath));
  });
  const http = require("http").createServer(app);
  const io = require("socket.io")(http);
  //socket.io
  let users = [];
  io.on("connection", (socket) => {
    //console.log(socket.id + "connected");

    socket.on("joinRoom", (id) => {
      const user = { userId: socket.id, room: id };

      const check = users.every((user) => user.userId !== socket.id);

      if (check) {
        users.push(user);
        socket.join(user.room);
      } else {
        users.map((user) => {
          if (user.userId === socket.id) {
            if (user.room !== id) {
              socket.leave(user.room);
              socket.join(id);
              user.room = id;
            }
          }
        });
      }

      // console.log(users);
      // console.log(socket.adapter.rooms);
    });

    socket.on("createComment", (taskId) => {
      io.to(taskId).emit("sendCommentToClient", taskId);
    });

    socket.on("disconnect", () => {
      users = users.filter((user) => user.userId !== socket.id);
      //console.log(socket.id + "disconnected");
    });
  });

  // glob routes file
  config.getGlobbedFile("./server/routes/**/*.js").forEach((routePath) => {
    require(path.resolve(routePath))(app);
  });

  //serving static file for deploy
  if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "..", "client", "build")));
    app.get("/", (req, res) => {
      res.sendFile(
        path.resolve(__dirname, "..", "client", "build", "index.html")
      );
    });
  }
  return http;
};
