const socket = io();

var form = document.getElementById("chat-form");
var input = document.getElementById("msg");
var chatMessages = document.querySelector(".chat-messages");
var roomName = document.getElementById("room-name");
var usersList = document.getElementById("users");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("joinRoom", { username, room });

socket.on("room-details", ({ room, users }) => {
  outputRoom(room);
  outputUsers(users);
});

socket.on("message", (msg) => {
  outputMessage(msg);
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

socket.on("chat message", (msg) => {
  outputMessage(msg);
});

socket.on("disconnect message", (msg) => {
  outputMessage(msg);
});

function outputMessage(msg) {
  var div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p><p class="text">${msg.text}</p>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function outputRoom(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  usersList.innerHTML = users
    .map((user) => `<li>${user.username}</li>`)
    .join("");
}
