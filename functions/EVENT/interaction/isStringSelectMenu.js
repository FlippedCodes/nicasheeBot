module.exports.run = async (interaction) => {
  const func = client.functions.get(`ENGINE_${interaction.customId}`);
  if (func) return func.run(interaction).catch(ERR);
};

module.exports.data = {
  name: 'isStringSelectMenu',
};
