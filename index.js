// init Discord
const { Client, Intents, Collection } = require('discord.js');
// init command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// init Discord client
const client = new Client({ disableEveryone: true, intents: [Intents.FLAGS.GUILDS] });
// init filesystem
const fs = require('fs');
// init config
const config = require('./config.json');

client.commands = new Collection();

global.CmdBuilder = SlashCommandBuilder;

// Login the bot
client.login(process.env.DCtoken)
  .then(() => {
    // import Functions and Commands
    config.setup.startupFunctions.forEach((FCN) => {
      const INIT = require(`./functions/${FCN}.js`);
      INIT.run(client, fs, config);
    });
  });

client.once('ready', () => {
  // confirm user logged in
  console.log(`[${config.name}] Logged in as "${client.user.tag}"!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  command.run(client, interaction)
    .catch(console.log);
});
