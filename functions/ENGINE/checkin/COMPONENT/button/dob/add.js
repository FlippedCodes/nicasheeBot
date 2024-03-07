const {
  ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle,
} = require('discord.js');

const actionsRow = new ActionRowBuilder()
  .addComponents([
    new TextInputBuilder()
      .setCustomId('nsfw_COMPONENT_modal_dobAdd_DoB')
      .setLabel('Please provide the DoB of this user')
      .setRequired(true)
      .setMinLength(8)
      .setMaxLength(10)
      .setPlaceholder('YYYY-MM-DD')
      .setStyle(TextInputStyle.Short),
  ]);

module.exports.run = async (interaction) => {
  if (!interaction.member.roles.cache.has(config.teamRole)) return messageFail(interaction, 'Please wait for a Staffmember to verify you.\nYou can\'t use the buttons.');
  const modal = new ModalBuilder()
    .setCustomId('nsfw_COMPONENT_modal_dobAdd')
    .setTitle('Add DoB');

  modal.addComponents(actionsRow);
  await interaction.showModal(modal);
};

module.exports.data = {
  name: 'add',
};
