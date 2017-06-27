const _ = require('lodash');
let messages = []; // data store - fake db

const messageController = {

  postMessage: (message) => {
    // TODO: do any necessary sanitization
    messages.push(message);
  },

  getMessages: (chatRoomId) => {
    return _.filter(messages, (message) => {
      return message.chatRoomId === chatRoomId;
    });
  },

  deleteMessages: (chatRoomId) => {
    _.remove(messages, (message) => {
      return message.chatRoomId === chatRoomId;
    });
  }

};

module.exports = messageController;
