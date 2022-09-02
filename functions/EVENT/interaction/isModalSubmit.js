module.exports.run = async (interaction) => {
  interaction.deferUpdate();
  if (!interaction.member.roles.cache.has(config.teamRole)) return;
  return client.functions.get(`ENGINE_${interaction.customId}`).run(interaction).catch(ERR);
};

module.exports.data = {
  name: 'isModalSubmit',
};
