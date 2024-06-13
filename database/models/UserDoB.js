const Sequelize = require('sequelize');

module.exports = sequelize.define('UserDoB', {
  ID: {
    type: Sequelize.STRING(30),
    primaryKey: true,
  },
  allow: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  teammemberID: Sequelize.STRING(30),
  serverID: Sequelize.STRING(30),
});
