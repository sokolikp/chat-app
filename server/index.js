const router = require('express').Router();

router.use('/api', require('./routes/routes.js'));

module.exports = router;
