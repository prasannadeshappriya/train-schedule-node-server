/**
 * Created by prasanna_d on 10/20/2017.
 */

//Import repository files
const trainStationRepository = require('../repository/train.stations.repository');

module.exports = {
    updateTrainStations: async function(req,res){
        let respond = await trainStationRepository.updateTrainStationList();
        res.status(200).json({message: 'done', data: JSON.stringify(respond)});
    }
};