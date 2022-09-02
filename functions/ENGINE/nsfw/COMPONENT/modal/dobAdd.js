const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const moment = require('moment');

const userDoB = require('../../../../../database/models/UserDoB');

async function addUser(ID, DoB, allow, teammemberID) {
  if (await userDoB.findOne({ where: { ID } }).catch(ERR)) return false;
  await userDoB.findOrCreate({ where: { ID }, defaults: { DoB, allow, teammemberID } }).catch(ERR);
  return true;
}

const buttonsSetup = ({ DoB, DoBDisabled }) => new ActionRowBuilder()
  .addComponents([
    new ButtonBuilder()
      .setCustomId('checkin_COMPONENT_button_allow')
      .setEmoji('👌')
      .setLabel(DoBDisabled ? 'Verfiy first' : 'Allow')
      .setDisabled(DoBDisabled)
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('checkin_COMPONENT_button_deny')
      .setEmoji('✋')
      .setLabel('Deny')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('checkin_COMPONENT_button_dob_checked')
      .setEmoji('🔞')
      .setLabel('ID checked')
      .setDisabled(!DoBDisabled)
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('checkin_COMPONENT_button_dob_add')
      .setEmoji('➕')
      .setLabel(DoB)
      .setDisabled(DoBDisabled)
      .setStyle(ButtonStyle.Secondary),
  ]);

module.exports.run = async (interaction) => {
  const rawDate = interaction.fields.getTextInputValue('nsfw_COMPONENT_modal_dobAdd_DoB');
  const dateFormat = config.DoBchecking.dateFormats;
  const DoB = moment(rawDate, dateFormat, true);
  const userID = interaction.channel.name;
  const teammemberID = interaction.user.id;
  const oldEmbeds = interaction.message.embeds;

  if (!DoB.isValid()) {
    const failedButtons = buttonsSetup({ DoB: 'Failed: Invalid Date Format', DoBDisabled: false });
    return interaction.message.edit({ embeds: [oldEmbeds[0]], components: [failedButtons] });
  }

  const formatDoB = DoB.format(dateFormat[0]);
  const saveSuccess = await addUser(userID, formatDoB, false, teammemberID);
  if (!saveSuccess) {
    const failedButtons = buttonsSetup({ DoB: 'Failed: Already added', DoBDisabled: true });
    return interaction.message.edit({ embeds: [oldEmbeds[0]], components: [failedButtons] });
  }

  const newButtons = buttonsSetup({ DoB: formatDoB, DoBDisabled: true });
  interaction.message.edit({ embeds: [oldEmbeds[0]], components: [newButtons] });
};

module.exports.data = {
  name: 'dobAdd',
};
