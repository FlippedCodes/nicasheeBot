const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

// Ping kickoff for bot latency
async function kickoff(interaction) {
  const sendMessage = await new MessageEmbed()
    .setDescription('📤 Pong...')
    .setColor();
  const sentMessage = await interaction.reply({ embeds: [sendMessage], fetchReply: true });
  return sentMessage;
}

// message for data return
function editedMessage(sentMessage, interaction) {
  const api_latency = Math.round(sentMessage.client.ws.ping);
  const body = `📥 Pong!
  Bot latency is \`${sentMessage.createdTimestamp - interaction.createdTimestamp}\`ms.
  API latency is \`${api_latency}\`ms`;
  return new MessageEmbed()
    .setDescription(body)
    .setColor();
}

// posts ping message and edits it afterwards
async function checkPing(interaction) {
  const sentReply = await kickoff(interaction);
  const test = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('test')
        .setEmoji('💩')
        .setLabel('Testo')
        .setStyle('DANGER'),
    );
  interaction.editReply({ embeds: [editedMessage(sentReply, interaction)], components: [test] });
}

module.exports.run = async (client, interaction) => checkPing(interaction);

module.exports.data = new CmdBuilder()
  .setName('nsfw')
  .setDescription('Manages nsfw access.')
  .addSubcommand((subcommand) => subcommand
    .setName('add')
    .setDescription('Adds an entry.')
    .addUserOption((option) => option.setName('user').setDescription('Provide a user to to add.').setRequired(true))
    .addStringOption((option) => option.setName('date').setDescription('Provide the users DoB.').setRequired(true)))
  .addSubcommand((subcommand) => subcommand
    .setName('allow')
    .setDescription('Allow access to nsfw rooms.')
    .addUserOption((option) => option.setName('user').setDescription('Provide a user to to edit.').setRequired(true))
    .addBooleanOption((option) => option.setName('allow').setDescription('Set the allowance.').setRequired(true)))
  .addSubcommand((subcommand) => subcommand
    .setName('change')
    .setDescription('Change the DoB of an entry.')
    .addUserOption((option) => option.setName('user').setDescription('Provide a user to to add.').setRequired(true))
    .addStringOption((option) => option.setName('date').setDescription('Provide the users DoB.').setRequired(false)))
  .addSubcommand((subcommand) => subcommand
    .setName('search')
    .setDescription('Search an entry.')
    .addUserOption((option) => option.setName('user').setDescription('Provide a user to to add.').setRequired(true)))
  .addSubcommand((subcommand) => subcommand
    .setName('calc')
    .setDescription('Calcupate the age from a DoB')
    .addStringOption((option) => option.setName('date').setDescription('Provide the users DoB.').setRequired(true)));
