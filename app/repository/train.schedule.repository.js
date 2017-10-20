/**
 * Created by prasanna_d on 10/20/2017.
 */
const scraper = require('cloudscraper');
const cheerio = require("cheerio");
var tabletojson = require('tabletojson');

//Constants
const siteUrl = 'https://eservices.railway.gov.lk/schedule/searchTrain.action?lang=en';
//Add repository classes
const trainStationRepository = require('../repository/train.stations.repository');

module.exports = {
    getTrainSchedule: async function(schedule, callback){
        //108 -> 246
        let start_station_item = await trainStationRepository.getTrainStation(schedule.start_station);
        let end_station_item = await trainStationRepository.getTrainStation(schedule.end_station);
        //validation
        if(start_station_item===null || end_station_item===null){
            return callback("Invalid station");
        }

        await scraper.post(
            siteUrl,
            {
                'searchCriteria.startStationID': start_station_item.station_id,
                'searchCriteria.endStationID': end_station_item.station_id,
                'searchCriteria.startTime': schedule.start_time,
                'searchCriteria.endTime': schedule.end_time,
                'searchDate': schedule.date
            },
            function(error, response, body) {
                if (error) {
                    console.log('Error occurred: ' + error);
                } else {
                    let trainScheduleTable = tabletojson.convert(body);
                    let results = [];
                    let tmpObj = {details: {}};
                    Object.keys(trainScheduleTable)
                        .forEach(async function(key){
                            let item = trainScheduleTable[key];
                            Object.keys(item)
                                .forEach(async function(child_key) {
                                    let super_item = item[child_key];
                                    if(super_item.hasOwnProperty('Your Station')){
                                        if(super_item['Your Station']!==""){
                                            let isDetails = false;
                                            if(!super_item['Your Station'].includes('Available')){
                                                tmpObj = {details: {}}; isDetails = true;
                                            }
                                            Object.keys(super_item)
                                                .forEach(async function(super_child_key) {
                                                    if(isDetails){
                                                        tmpObj[super_child_key]
                                                            = super_item[super_child_key];
                                                    }else{
                                                        tmpObj.details[super_child_key]
                                                            = super_item[super_child_key];
                                                    }
                                                });
                                            if(super_item['Your Station'].includes('Available')){
                                                results.push(tmpObj);
                                            }
                                        }
                                    }
                                });
                        });
                    return callback(results);
                }
        });
    }
};