require("dotenv").config();
import express, { NextFunction } from "express";
import config from "config";
import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";
import router from "./routes";
import cookieParser from "cookie-parser";
import { Socket } from "socket.io";
const http = require("http");

const cors = require("cors");

const app = express();

app.use(express.urlencoded({ extended: false, limit: "50mb" }));

app.use(express.json({ limit: "50mb" }));

app.use(router);

app.use(cookieParser());

const port = config.get("port");

app.use(
  cors()
);
app.use("/", express.static("public"));

app.get("/", (req, res) => {
  res.send("Server is running");
});

const server = http.createServer(app); // Create an HTTP server from the Express app

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.use((socket: any, next: NextFunction) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

io.on("connection", (socket: any) => {
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit("users", users);

  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });

  socket.on("private message", ({ content, to }: { content: string, to: string}) => {
    console.log("EMITTING", { content, to})
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });
});

server.listen(port, () => {
  log.info(`App listening http://localhost:${port}`);

  connectToDb();
});
