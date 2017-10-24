/**
 * Created by prasanna_d on 10/23/2017.
 */
const models = require('../database/models');

module.exports = {
    getTrainSchedule: async function(dateId, start_station_id, end_station_id){
        return await models.schedule_offline_storage.findOne({
            where: {
                start_station_id: start_station_id,
                end_station_id: end_station_id,
                week_date_id: dateId
            }
        })
    },
    updateTrainSchedule: async function(dateId, start_station_id, end_station_id, result_string){
        return await models.schedule_offline_storage.update({
            start_station_id: start_station_id,
            end_station_id: end_station_id,
            result_string: result_string
        },{
            where: {week_date_id: dateId}
        });
    },
    writeTrainSchedule: async function(dateId, start_station_id, end_station_id, result_string){
        return await models.schedule_offline_storage.create({
            week_date_id: dateId,
            start_station_id: start_station_id,
            end_station_id: end_station_id,
            result_string: result_string
        });
    },
    findOrCreateTrainSchedule: async function(dateId, start_station_id, end_station_id, result_string){
        return await models.schedule_offline_storage.findOrCreate({
            where: {
                week_date_id: dateId
            },
            defaults: {
                week_date_id: dateId,
                start_station_id: start_station_id,
                end_station_id: end_station_id,
                result_string: result_string
            }
        });
    }
};