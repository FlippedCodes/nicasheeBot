const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const userDoB = require('../../../../../../database/models/UserDoB');

const buttonsSetup = ({ checkedText, DoB }) => new ActionRowBuilder()
  .addComponents([
    new ButtonBuilder()
      .setCustomId('checkin_COMPONENT_button_allow')
      .setEmoji('👌')
      .setLabel('Allow')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('checkin_COMPONENT_button_deny')
      .setEmoji('✋')
      .setLabel('Deny')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('checkin_COMPONENT_button_dob_checked')
      .setEmoji('🔞')
      .setLabel(checkedText)
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('checkin_COMPONENT_button_dob_add')
      .setEmoji('➕')
      .setLabel(DoB)
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary),
  ]);

async function changeUser(ID, allow) {
  if (await !userDoB.findOne({ where: { ID } }).catch(ERR)) return false;
  await userDoB.update({ allow }, { where: { ID } }).catch(ERR);
  return true;
}

module.exports.run = async (interaction) => {
  if (!interaction.member.roles.cache.has(config.teamRole)) return messageFail(interaction, 'Please wait for a Staffmember to verify you.\nYou can\'t use the buttons.');
  await interaction.deferUpdate();

  const userID = interaction.channel.name;
  const oldEmbeds = interaction.message.embeds;

  const DoB = interaction.message.components[0].components.find((btn) => btn.customId === 'checkin_COMPONENT_button_dob_add').label;

  const changed = await changeUser(userID, true);
  if (!changed) {
    const failedButtons = buttonsSetup({ checkedText: 'Failed: Missing entry' });
    return interaction.message.edit({ embeds: [oldEmbeds[0]], components: [failedButtons] });
  }

  const newButtons = buttonsSetup({ checkedText: 'Success: Checked', DoB });
  interaction.message.edit({ embeds: [oldEmbeds[0]], components: [newButtons] });
};

module.exports.data = {
  name: 'checked',
};
