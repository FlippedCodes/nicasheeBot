module.exports.run = async (interaction) => {
  const func = client.functions.get(`ENGINE_${interaction.customId}`);
  if (func) {
    interaction.deferUpdate();
    return func.run(interaction).catch(ERR);
  }
};

module.exports.data = {
  name: 'isModalSubmit',
};
