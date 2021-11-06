const path = require("path");
const http = require("http");
const express = require("express");
const formatMessages = require("./utils/formatMessages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);

const socket = require("socket.io");
const io = socket(server);

app.use(express.static("./public"));

//sending static file
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

botName = "Chat Cord";

//run when client connect
io.on("connection", (socket) => {
  console.log("new web socket connection " + socket.id);
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    socket.emit("message", formatMessages(botName, "Welcome to chatchord"));

    socket.broadcast
      .to(user.room)
      .emit("message", formatMessages(botName, `${user.username} is joined`));

    io.to(user.room).emit("room-details", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //socket.broadcast.emit sends to everyone except the sending socket
  //socket.emit sends to the current socket

  socket.on("chat message", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("chat message", formatMessages(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "disconnect message",
        formatMessages(botName, `${user.username} left`)
      );

      io.to(user.room).emit("room-details", {
        room: user.room,
        users: getRoomUsers(user.room),
      });

      console.log(socket.id + " left");
    } //io.emit sends to everyone except the current socket
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
