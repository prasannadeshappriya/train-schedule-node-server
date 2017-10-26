'use strict';
module.exports = (sequelize, DataTypes) => {
  var schedule_offline_storage = sequelize.define('schedule_offline_storage', {
    start_station_id: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    end_station_id: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    week_date_id: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    result_string: {
      type:DataTypes.TEXT,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return schedule_offline_storage;
};