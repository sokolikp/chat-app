const bodyParser = require('body-parser');
const userHandler = require('./user-handler.js');
const roomHandler = require('./room-handler.js');
const messageHandler = require('./message-handler.js');

module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // structure API in the form: /<handler>/<handler route>
  // e.g. /user/users for the users route within the user handler
  app.use('/api/user', userHandler);
  app.use('/api/room', roomHandler);
  app.use('/api/message', messageHandler);
};
