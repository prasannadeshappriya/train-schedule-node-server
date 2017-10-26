/**
 * Created by prasanna_d on 10/26/2017.
 */
const express = require('express');
const router = express.Router();

//Add controllers
const devController = require('../app/controller/dev.controller');

/* GET users listing. */
router.get('/trainScheduleOfflineStorage', devController.getAllOfflineData);
router.get('/trainStations', devController.getAllTrainStations);

module.exports = router;
