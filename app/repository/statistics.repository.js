/**
 * Created by prasanna_d on 10/24/2017.
 */
//Import model files
const statisticsModel = require('../model/statistics.model');

module.exports = {
    updateUserStatisticsTrainWebApp: async function(){
        try {
            let respond = await statisticsModel.getTrainAppStatistics();
            if (respond.length === 0) {
                respond = await  statisticsModel.createNewTrainAppStatistics();
                return true;
            } else {
                let statistics = respond[0];
                let current_count = statistics.dataValues.train_schedule_app_stat;
                respond = await statisticsModel.updateTrainAppStatistics(
                    statistics.dataValues.id, (current_count + 1)
                );
                return true;
            }
        }catch (err){
            console.log('error on updating statistics');
            console.log(err);
            return true;
        }
    }
};