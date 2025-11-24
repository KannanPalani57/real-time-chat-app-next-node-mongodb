require("dotenv").config();
import express, { NextFunction } from "express";
import config from "config";
import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";
import router from "./routes";
import cookieParser from "cookie-parser";
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { findAllUser, findUserById } from "./service/userService";
import MessagesModel from "./model/messagesModel";

import { encrypt } from "./helpers/crypto";

const http = require("http");

const cors = require("cors");

const app = express();

app.use(express.urlencoded({ extended: false, limit: "50mb" }));

app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(router);

app.use(cookieParser());

const port = config.get("port");

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

// io.use((socket: any, next: NextFunction) => {
//   const username = socket.handshake.auth.username;
//   if (!username) {
//     return next(new Error("invalid username"));
//   }
//   socket.username = username;
//   next();
// });

io.use((socket: any, next: NextFunction) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("No token provided"));
  }

  try {
    // verify token
    const payload = jwt.verify(token, "randomevale");

    // attach user info to socket
    socket.userId = payload._id;
    // socket.username = payload.username;

    next();
  } catch (err) {
    console.error("JWT verification error:");
    next(new Error("Invalid token"));
  }
});

io.on("connection", async (socket: any) => {
  console.log("user id", socket.userId);

  socket.join(socket.userId);

  const user = await findUserById(socket.userId);

  // const users = [];
  // for (let [id, socket] of io.of("/").sockets) {
  //   users.push({
  //     userID: id,
  //     username: user?.firstName,
  //   });
  // }

  let users = await findAllUser();

  let allUsers = [];

  allUsers = users.map((item) => ({
    userID: item._id,
    username: item.userName,
  }));

  socket.emit("users", allUsers);

  socket.broadcast.emit("user connected", {
    userID: socket.userId,
    username: user?.userName,
  });

  socket.on(
    "private message",
    async ({ content, to }: { content: string; to: string }) => {
      console.log("EMITTING", { content, to });
      socket.to(to).to(socket.userId).emit("private message", {
        content,
        from: socket.userId,
        to,
      });

      const created_message = await MessagesModel.create({
        fromUserId: socket.userId,
        toUserId: to,
        contentEncrypted: encrypt(content),
      });

      console.log({ created_message });
    }
  );

  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
    }
  });
});

server.listen(port, () => {
  log.info(`App listening http://localhost:${port}`);

  connectToDb();
});
