const express = require('express');
const router = express.Router();

//Add controllers
const userController = require('../app/controller/user.controller');

/* GET users listing. */
router.get('/schedule', userController.getTrainSchedule);
router.post('/update_statistics_trainwebapp', userController.updateScheduleWebAppStats);

module.exports = router;
