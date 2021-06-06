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
  io.on("connection", (socket) => {
    console.log(socket.id + "connected");

    socket.on("disconnect", () => {
      console.log(socket.id + "disconnected");
    });
  });

  // glob routes file
  config.getGlobbedFile("./server/routes/**/*.js").forEach((routePath) => {
    require(path.resolve(routePath))(app);
  });

  app.get("/", (req, res) => {
    res.send("Project Management API");
  });
  //serving static file for deploy
  if (process.env.NODE_ENV === "production") {
    app.use(
      "/build",
      express.static(path.join(__dirname, "..", "client", "build"))
    );
    app.get("/home", (req, res) => {
      res.sendFile(
        path.resolve(__dirname, "..", "client", "build", "index.html")
      );
    });
  }
  return http;
};
