'use strict';
module.exports = (sequelize, DataTypes) => {
  var train_stations = sequelize.define('train_stations', {
    station_id: {
        type:DataTypes.INTEGER,
        allowNull: false,
    },
    station_name: {
        type:DataTypes.STRING,
        allowNull: false,
    },
    station_code: {
        type:DataTypes.STRING,
        allowNull: false,
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return train_stations;
};