module.exports.run = async (interaction) => {
  // await interaction.deferReply();
  if (!interaction.member.roles.cache.has(config.teamRole)) return messageFail(interaction, 'Please wait for a Staffmember to verify you.\nYou can\'t use the buttons.');
  return client.functions.get(`ENGINE_${interaction.customId}`).run(interaction).catch(ERR);
  // if (interaction.channelId === config.functions.checkin.outputChannels.todo) {
  //   if (!interaction.member.roles.cache.has(config.teamRole)) return;
  // }
};

module.exports.data = {
  name: 'isCommand',
};
