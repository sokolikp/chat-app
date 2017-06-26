const _ = require('lodash');
let users = []; // data store - fake db

const userController = {

  createUser: (user) => {
    // TODO: do any necessary sanitization
    users.push(user);
  },

  getUsers: (chatRoomId) => {
    return _.map(users, (message) => {
      return user.chatRoomId === chatRoomId;
    });
  }

};

module.exports = userController;
