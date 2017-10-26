/**
 * Created by prasanna_d on 10/20/2017.
 */

//Add repository files
const trainScheduleRepository = require('../repository/train.schedule.repository');
const statisticsRepository = require('../repository/statistics.repository');

module.exports = {
    updateScheduleWebAppStats: async function(req,res){
        await statisticsRepository.updateUserStatisticsTrainWebApp();
        res.Header().Add("Access-Control-Allow-Origin", "*");
        res.status(200);
    },
    getTrainSchedule: async function(req,res){
        //Check the query data existence
        if(typeof req.query==='undefined'){
            return res.status(400).json({message: 'query data is required'});}

        //Get the query data
        let start_station = req.query.start_station;
        let end_station = req.query.end_station;
        let start_time = req.query.start_time;
        let end_time = req.query.end_time;
        let date = req.query.date;

        //validate query data
        if(typeof start_station==='undefined' || start_station===''){
            return res.status(400).json({message: 'start_station is required'});}
        if(typeof end_station==='undefined' || end_station===''){
            return res.status(400).json({message: 'end_station is required'});}
        if(typeof start_time==='undefined' || start_time===''){
            return res.status(400).json({message: 'start_time is required'});}
        if(typeof end_time==='undefined' || end_time===''){
            return res.status(400).json({message: 'end_time is required'});}
        if(typeof date==='undefined' || date===''){
            return res.status(400).json({message: 'date is required'});}

        let schedule = {
            start_station: start_station,
            end_station: end_station,
            start_time: start_time,
            end_time: end_time, date: date
        };

        let respond = await trainScheduleRepository.getTrainSchedule(schedule, function(respond, isOnline){
            res.status(200).json({online: isOnline, data: respond});
        });

    }
};