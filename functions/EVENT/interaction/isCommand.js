module.exports.run = async (interaction) => {
  const command = client.commands.get(interaction.commandName);
  if (command) {
    command.run(interaction).catch(ERR);
    return;
  }
};

module.exports.data = {
  name: 'isCommand',
};
