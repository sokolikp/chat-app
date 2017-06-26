const _ = require('lodash');
let messages = []; // data store - fake db

const messageController = {

  postMessage: (message) => {
    // TODO: do any necessary sanitization
    messages.push(message);
  },

  getMessages: (chatRoomId) => {
    return _.map(messages, (message) => {
      return message.chatRoomId === chatRoomId;
    });
  }

};

module.exports = messageController;
