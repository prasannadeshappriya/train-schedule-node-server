/**
 * Created by prasanna_d on 10/20/2017.
 */
const scraper = require('cloudscraper');
const cheerio = require("cheerio");
const tableToJson = require('tabletojson');

//Constants
const siteUrl = 'https://eservices.railway.gov.lk/schedule/searchTrain.action?lang=en';
//Add repository classes
const trainStationRepository = require('../repository/train.stations.repository');
//Add model classes
const trainScheduleModel = require('../model/train.schedule.model');

async function getDayIdFromDate(dateString) {
    //Sunday - 0, Monday - 1, ......, Saturday - 6
    dateString = dateString.split("/");
    try {
        let baseDate = new Date(Date.UTC(
            dateString[2], (dateString[1]-1), dateString[0]));
        return baseDate.getDay();
    }catch (err){ return NaN; }
}

async function loadOfflineResults(dateId, schedule, callback){
    let start_station_item = await trainStationRepository.getTrainStation(schedule.start_station);
    let end_station_item = await trainStationRepository.getTrainStation(schedule.end_station);
    try {
        let db_response = await trainScheduleModel.getTrainSchedule(
            dateId, start_station_item.station_id, end_station_item.station_id
        );
        return callback(db_response);
    }catch (err) {
        console.log("error on 'loadOfflineResults' function:");
        console.log(err);
        return callback(JSON.stringify("[]"));
    }
}

async function writeDataToOfflineStorage(dateId, schedule, result, callback){
    let start_station_item = await trainStationRepository.getTrainStation(schedule.start_station);
    let end_station_item = await trainStationRepository.getTrainStation(schedule.end_station);
    try {
        let db_response = await trainScheduleModel.findOrCreateTrainSchedule(
            dateId, start_station_item.station_id, end_station_item.station_id, JSON.stringify(result)
        );
        if (!db_response[1]) {
            db_response = await trainScheduleModel.updateTrainSchedule(
                dateId, start_station_item.station_id, end_station_item.station_id, JSON.stringify(result)
            );
        }
        return callback();
    }catch (err) {
        console.log("error on 'writeDataToOfflineStorage' function:");
        console.log(err);
        return callback();
    }
}

module.exports = {
    getAllOfflineData: async function(){
        return await trainScheduleModel.getTrainScheduleOfflineData();
    },
    getTrainSchedule: async function(schedule, callback){
        //108 -> 246
        let start_station_item = await trainStationRepository.getTrainStation(schedule.start_station);
        let end_station_item = await trainStationRepository.getTrainStation(schedule.end_station);
        //validation
        if(start_station_item===null || end_station_item===null){
            return callback("Invalid station");
        }

        let dateId = await getDayIdFromDate(schedule.date);

        try {
            await scraper.post(
                siteUrl,
                {
                    'searchCriteria.startStationID': start_station_item.station_id,
                    'searchCriteria.endStationID': end_station_item.station_id,
                    'searchCriteria.startTime': schedule.start_time,
                    'searchCriteria.endTime': schedule.end_time,
                    'searchDate': schedule.date
                },
                async function (error, response, body) {
                    if (error) {
                        console.log('Error occurred: ' + error);
                    } else {
                        let trainScheduleTable = tableToJson.convert(body);
                        let results = {normal: [], connected: []};
                        let tmpObj = {details: {}};
                        Object.keys(trainScheduleTable)
                            .forEach(async function (key) {
                                let item = trainScheduleTable[key];
                                Object.keys(item)
                                    .forEach(async function (child_key) {
                                        let super_item = item[child_key];
                                        if (super_item.hasOwnProperty('Your Station')) {
                                            if (super_item['Your Station'] !== "") {
                                                let isDetails = false;
                                                if (!super_item['Your Station'].includes('Available')) {
                                                    tmpObj = {details: {}};
                                                    isDetails = true;
                                                }
                                                Object.keys(super_item)
                                                    .forEach(async function (super_child_key) {
                                                        super_item[super_child_key] =
                                                            super_item[super_child_key].replace(new RegExp('\t', 'g'), '');
                                                        super_item[super_child_key] =
                                                            super_item[super_child_key].replace(new RegExp('\r\n', 'g'), '');
                                                        if (isDetails) {
                                                            tmpObj[super_child_key]
                                                                = super_item[super_child_key];
                                                        } else {
                                                            tmpObj.details[super_child_key]
                                                                = super_item[super_child_key];
                                                        }
                                                    });
                                                if (super_item['Your Station'].includes('Available')) {
                                                    results.normal.push(tmpObj);
                                                }
                                            }
                                        }
                                    });
                            });
                        let $ = cheerio.load(body),
                            $connected_trains_table= $('.hero-unit');
                        let connected_train_tables = [];
                        Object.keys($connected_trains_table)
                            .forEach(function (key) {
                                let connected_train_code = $connected_trains_table[key];
                                let connected_train_table = tableToJson.convert(connected_train_code);
                                for(let item in connected_train_table) {
                                    for(let i=0; i<connected_train_table[item].length; i++){
                                        let table_item = connected_train_table[item][i];
                                        if(Object.keys(connected_train_table[item][i]).length===6){
                                            let tmpObj = {};
                                            Object.keys(table_item)
                                                .forEach(function (key) {
                                                    tmpObj[key] = table_item[key];
                                                });
                                            connected_train_tables.push(tmpObj);
                                            results.connected.push(tmpObj);
                                        }
                                    }
                                }
                            });
                        if(results.normal.length===0 && results.connected.length===0){
                            await loadOfflineResults(dateId, schedule, async function (offlineResults) {
                                try{
                                    if(offlineResults) {
                                        return callback(
                                            JSON.parse(offlineResults.dataValues.result_string), false);
                                    }else {return callback([], false)}
                                }catch (err){
                                    console.log('Error parsing database string into json:');
                                    console.log(err.toString());}
                            });
                        }else {
                            await writeDataToOfflineStorage(dateId,schedule,results,async function(){
                                return callback(results, true);
                            });
                        }
                    }
                });
        }catch (err){
            await loadOfflineResults(dateId, schedule, async function (offlineResults) {
                try{
                    return callback(
                        JSON.parse(offlineResults.dataValues.result_string), false);
                }catch (err){
                    console.log('Error parsing database string into json:');
                    console.log(err.toString());}
            });
        }
    }
};