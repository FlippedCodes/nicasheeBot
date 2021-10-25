// init Discord
const { Client, Intents, Collection } = require('discord.js');
// init file system
const fs = require('fs');
// init command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// setting essential global values
// init Discord client
global.client = new Client({ disableEveryone: true, intents: [Intents.FLAGS.GUILDS] });
// init config
global.config = require('./config.json');

global.DEBUG = process.env.NODE_ENV === 'development';

// global.main = {};
global.CmdBuilder = SlashCommandBuilder;

global.ERR = (err) => console.error('ERROR:', err);

// creating collections
client.commands = new Collection();
client.functions = new Collection();

// anouncing debug mode
if (DEBUG) console.log(`[${config.name}] Bot is on Debug-Mode. Some functions are not going to be loaded.`);

// Login the bot
client.login(process.env.DCtoken)
  .then(() => {
    // import Functions and Commands; startup database connection
    fs.readdirSync('./functions/STARTUP').forEach((FCN) => {
      if (FCN.search('.js') === -1) return;
      const INIT = require(`./functions/STARTUP/${FCN}`);
      INIT.run(fs);
    });
  });

client.on('ready', async () => {
  // confirm user logged in
  console.log(`[${config.name}] Logged in as "${client.user.tag}"!`);

  // setup tables
  console.log('[DB] Syncing tables...');
  await sequelize.sync();
  await console.log('[DB] Done syncing!');

  // set bot user status
  const setupFunctions = client.functions.filter((fcn) => fcn.data.callOn === 'setup');
  setupFunctions.forEach((FCN) => FCN.run());
});

client.on('interactionCreate', async (interaction) => {
  // command handler
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (command) return command.run(interaction).catch(console.log);
  }
});
