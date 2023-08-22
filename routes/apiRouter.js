const express = require('express');
const router = express.Router();
const apiController = require('../controller/apiController.js');

router.get('/sms/:id', apiController.getSms );

module.exports = router;