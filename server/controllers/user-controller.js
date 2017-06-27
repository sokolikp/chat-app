const _ = require('lodash');
let users = []; // data store - fake db

const userController = {

  createUser: (user) => {
    // TODO: do any necessary sanitization
    users.push(user);
  },

  createDefaultUser: (roomId, socketId, nextId) => {
    let user = {
      id: socketId,
      name: "anon " + nextId,
      chatRoomId: roomId
    };
    users.push(user);
    return user;
  },

  getUsers: (roomId) => {
    return _.map(users, (message) => {
      return user.chatRoomId === roomId;
    });
  },

  getUser: (id) => {
    return _.find(users, (user) => {
      return user.id === id;
    });
  },

  isNameValid: (name, roomId) => {
    let existing = _.find(users, (user) => {
      return user.name === name && user.chatRoomId === roomId;
    });

    return !existing;
  },

  deleteUser: (id) => {
    let removed = _.remove(users, (user) => {
      return user.id === id;
    });
    return removed;
  }

};

module.exports = userController;
