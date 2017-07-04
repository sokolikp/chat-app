const router = require('express').Router();
const userHandler = require('./user-handler.js');
const roomHandler = require('./room-handler.js');
const messageHandler = require('./message-handler.js');

// structure API in the form: /<handler>/<handler route>
// e.g. /user/users for the users route within the user handler
router.use('/user', userHandler);
router.use('/room', roomHandler);
router.use('/message', messageHandler);

module.exports = router;
