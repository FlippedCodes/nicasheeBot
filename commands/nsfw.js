const moment = require('moment');

const { EmbedBuilder } = require('discord.js');

module.exports.run = async (interaction) => {
  await interaction.deferReply();

  // only guild command
  if (!await interaction.inGuild()) return messageFail(interaction, 'This command is for servers only.');
  // check if user is teammember
  if (!interaction.member.roles.cache.find(({ id }) => id === config.teamRole)) return messageFail(interaction, 'You don\'t have access to this command! òwó');
  const subName = interaction.options.getSubcommand();
  client.commands.get(`${interaction.commandName}_${subName}`).run(interaction, moment, EmbedBuilder);
};

module.exports.data = new CmdBuilder()
  .setName('nsfw')
  .setDescription('Manages nsfw access.')
  .addSubcommand((subcommand) => subcommand
    .setName('add')
    .setDescription('Adds an entry.')
    .addUserOption((option) => option.setName('user').setDescription('Provide a user to to add.').setRequired(true))
    .addStringOption((option) => option.setName('date').setDescription('Provide the users DoB. Format: YYYY/MM/DD').setRequired(true)))
  .addSubcommand((subcommand) => subcommand
    .setName('allow')
    .setDescription('Allow access to nsfw rooms.')
    .addUserOption((option) => option.setName('user').setDescription('Provide a user to to edit.').setRequired(true))
    .addBooleanOption((option) => option.setName('allow').setDescription('Set the allowance.').setRequired(true)))
  .addSubcommand((subcommand) => subcommand
    .setName('search')
    .setDescription('Search an entry.')
    .addUserOption((option) => option.setName('user').setDescription('Provide a user to to add.').setRequired(true)))
  .addSubcommand((subcommand) => subcommand
    .setName('calc')
    .setDescription('Calculate the age from a DoB')
    .addStringOption((option) => option.setName('date').setDescription('Provide the users DoB. Format: YYYY/MM/DD').setRequired(true)));
