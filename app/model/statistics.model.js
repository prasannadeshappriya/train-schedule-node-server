/**
 * Created by prasanna_d on 10/24/2017.
 */
const models = require('../database/models');

module.exports = {
    getTrainAppStatistics: async function(){
        return models.user_stats.findAll({
            where:{}
        });
    },
    createNewTrainAppStatistics: async function(){
        return models.user_stats.create({
            train_schedule_app_stat: 1
        });
    },
    updateTrainAppStatistics: async function(id, count){
        return models.user_stats.update({
            train_schedule_app_stat: count
        },{
            where: {id: id}
        });
    }
};
