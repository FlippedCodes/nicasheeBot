const Sequelize = require('sequelize');

module.exports.run = () => {
  console.log('[DB] Connecting...');

  const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      logging: DEBUG,
    },
  );
  console.log('[DB] Connected!');

  global.sequelize = sequelize;
};

module.exports.data = {
  name: 'DBConnection',
};
