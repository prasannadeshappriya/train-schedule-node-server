'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('schedule_offline_storages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      start_station_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      end_station_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      week_date_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      result_string: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('schedule_offline_storages');
  }
};