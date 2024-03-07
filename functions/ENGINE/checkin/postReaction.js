const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');

const moment = require('moment');

const userDoB = require('../../../database/models/UserDoB');

const buttonsSetup = ({ checked, DoB }) => new ActionRowBuilder()
  .addComponents([
    new ButtonBuilder()
      .setCustomId('checkin_COMPONENT_button_allow')
      .setEmoji('👌')
      .setLabel(!(checked && DoB) ? 'Verfiy first' : 'Allow')
      .setDisabled(!(checked && DoB))
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('checkin_COMPONENT_button_deny')
      .setEmoji('✋')
      .setLabel('Deny')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('checkin_COMPONENT_button_dob_checked')
      .setEmoji('🔞')
      .setLabel(checked && DoB ? 'Already checked ID' : 'ID checked')
      .setDisabled(checked)
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('checkin_COMPONENT_button_dob_add')
      .setEmoji('➕')
      .setLabel(DoB || 'Add DoB')
      .setDisabled(!!DoB)
      .setStyle(ButtonStyle.Secondary),
  ]);

async function getDate(channel) {
  // get all messages
  const messages = await channel.messages.fetch();
  // match date
  const dateRegEx = /\d{4}[-]\d{2}[-]\d{2}/gm;
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

async function addUser(ID, DoB, allow, teammemberID) {
  if (await userDoB.findOne({ where: { ID } }).catch(ERR)) return false;
  await userDoB.findOrCreate({ where: { ID }, defaults: { DoB, allow, teammemberID } }).catch(ERR);
  return true;
}

module.exports.run = async (message) => {
  // check if team fore was pinged and if channel is a checkin channel
  const embed = new EmbedBuilder()
    .setColor('Green')
    .setDescription('Please wait for a teammember to review your answers.')
    .setFooter({ text: 'You can ignore the buttons below.' });

  const userID = message.channel.name;
  const userDoB = await searchUser(userID);

  let DoB = false;
  if (!userDoB) {
    const date = await getDate(message.channel);
    if (date && date.isValid()) {
      DoB = date.format(config.DoBchecking.dateFormats[0]);
      // add entry
      await addUser(userID, DoB, false, client.user.id);
    }
  } else {
    DoB = moment(userDoB.DoB).format(config.DoBchecking.dateFormats[0]);
  }
  const checked = userDoB ? userDoB.allow : false;

  // dont activate 'checked' button, if DoB has not been checked
  const buttonsAdd = buttonsSetup({ checked: DoB ? checked : true, DoB });
  message.channel.send({ embeds: [embed], components: [buttonsAdd] });
};

module.exports.data = {
  name: 'postReaction',
};
