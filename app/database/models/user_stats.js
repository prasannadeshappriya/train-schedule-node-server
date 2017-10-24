'use strict';
module.exports = (sequelize, DataTypes) => {
  var user_stats = sequelize.define('user_stats', {
    train_schedule_app_stat: {
      type:DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return user_stats;
};