const Sequelize = require('sequelize');

const fs = require('fs');

const testToken = './config/config.json';

const config = require('../config/main.json');

const inDev = fs.existsSync(testToken);

console.log('[DB] Connecting...');
let database;
let user;
let password;
let host;
if (inDev) {
  const DBCredentials = require(`.${testToken}`).development;
  database = DBCredentials.database;
  user = DBCredentials.username;
  password = DBCredentials.password;
  host = DBCredentials.host;
} else {
  database = process.env.DBName;
  user = process.env.DBName;
  password = process.env.DBPassw;
  host = process.env.DBHost;
}
const sequelize = new Sequelize(
  database, user, password, { host, dialect: 'mysql', logging: inDev },
);
console.log('[DB] Connected!');

module.exports = sequelize;
global.sequelize = sequelize;
