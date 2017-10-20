/**
 * Created by prasanna_d on 10/20/2017.
 */
const models = require('../database/models');

module.exports = {
    updateTrainStationList: async function(arrTrainStationList){
        //Delete all train station names
        await models.train_stations.destroy({where: {}});

        let result = await models.train_stations.bulkCreate(arrTrainStationList);
        return result;
    }
};