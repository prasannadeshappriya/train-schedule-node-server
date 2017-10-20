const express = require('express');
const router = express.Router();

//Add controllers
const indexController = require('../app/controller/index.controller');

/* GET home page. */
router.post('/updateTrainStations', indexController.updateTrainStations);

module.exports = router;
