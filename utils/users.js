const users = [];

function userJoin(id, username, room) {
  var user = {
    id,
    username,
    room,
  };
  users.push(user);
  return user;
}

function getCurrentUser(id) {
  return users.find((user) => {
    if (user.id === id) {
      return user;
    }
  });
}

function userLeave(id) {
  const index = users.findIndex((user) => {
    if (user.id === id) {
      return user;
    }
  });

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUsers(room) {
  return users.filter((user) => {
    if (user.room === room) {
      return user;
    }
  });
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
