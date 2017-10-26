/**
 * Created by prasanna_d on 10/26/2017.
 */
//Add repository files
const trainScheduleRepository = require('../repository/train.schedule.repository');
const trainStationRepository = require('../repository/train.stations.repository');

module.exports = {
    getAllOfflineData: async function (req, res) {
        try{
            res.status(200).json({data: await trainScheduleRepository.getAllOfflineData()});
        }catch (err){
            res.status(500);
        }
    },
    getAllTrainStations: async function (req, res) {
        try{
            res.status(200).json({data: await trainStationRepository.getAllTrainStation()});
        }catch (err){
            res.status(500);
        }
    }
};