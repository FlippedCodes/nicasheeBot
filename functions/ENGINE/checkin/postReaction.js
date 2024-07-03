const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');

const moment = require('moment');

const userDoB = require('../../../database/models/UserDoB');

const buttonsSetup = ({ checked, checkedText }) => new ActionRowBuilder()
  .addComponents([
    new ButtonBuilder()
      .setCustomId('checkin_COMPONENT_button_allow')
      .setEmoji('👌')
      .setLabel(checkedText !== 'Already checked ID' ? 'Verfiy first' : 'Allow')
      .setDisabled(checkedText !== 'Already checked ID')
      // Not old enough
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('checkin_COMPONENT_button_deny')
      .setEmoji('✋')
      .setLabel('Deny')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('checkin_COMPONENT_button_dob_checked')
      .setEmoji('🔞')
      // eslint-disable-next-line no-nested-ternary
      .setLabel(checkedText)
      .setDisabled(checked)
      .setStyle(ButtonStyle.Secondary),
  ]);

async function getDate(channel) {
  // get all messages
  const messages = await channel.messages.fetch();
  // match date
  const dateRegEx = /\d{2}[/]\d{2}[/]\d{4}/gm;
  const found = await messages.filter((msg) => msg.content.match(dateRegEx) && msg.author.id === channel.name);
  if (!found.size) return;
  const coreMessage = found.entries().next().value[1].content;
  const rawDate = coreMessage.match(dateRegEx)[0];
  return moment(rawDate, config.DoBchecking.dateFormats, true);
}

async function searchUser(ID) {
  const result = await userDoB.findOne({ where: { ID } }).catch(ERR);
  return result;
}

async function addUser(ID, allow, teammemberID, serverID) {
  if (await userDoB.findOne({ where: { ID } }).catch(ERR)) return false;
  await userDoB.findOrCreate({ where: { ID }, defaults: { allow, teammemberID, serverID } }).catch(ERR);
  return true;
}

module.exports.run = async (message) => {
  // check if team fore was pinged and if channel is a check-in channel
  const embed = new EmbedBuilder()
    .setColor('Green')
    .setDescription('Please wait for a team member to review your answers.')
    .setFooter({ text: 'You can ignore the buttons below.' });

  const userID = message.channel.name;
  const userDoB = await searchUser(userID);

  let checked = false;
  let checkedText = 'ID checked';

  const date = await getDate(message.channel);
  console.debug(date.format('YYYY-MM-DD'));
  if (date && date.isValid()) {
    const age = moment().diff(date, 'years');
    if (age <= 18) {
      message.channel.send('Hello! You don\'t seem to be old enough for our server.\nPlease come back, when you are old enough.');
      checked = true;
      checkedText = 'Not old enough';
    }
  }

  if (!userDoB) {
    const allow = false;
    await addUser(userID, allow, client.user.id, message.guild.id);
  } else if (userDoB.allow) {
    // Known issue: "Not old enough" is being overwritten. Logic wise it is not easily fixable.
    checked = true;
    checkedText = 'Already checked ID';
  }

  // ping team, if not pinged already and only if user uses button/command
  const messages = await message.channel.messages.fetch();
  const mentions = messages.filter((message) => message.mentions.roles.has(config.teamRole));
  if (mentions.size === 0 && message.member.id === userID) message.channel.send(`<@&${config.teamRole}>`);

  const buttonsAdd = buttonsSetup({ checked, checkedText });
  // check, if it was deferred
  if (message.deferred) return message.editReply({ embeds: [embed], components: [buttonsAdd] });
  message.reply({ embeds: [embed], components: [buttonsAdd] });
};

module.exports.data = {
  name: 'postReaction',
};
