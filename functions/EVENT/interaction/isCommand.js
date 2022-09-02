module.exports.run = async (interaction) => {
  const command = client.commands.get(interaction.commandName);
  if (command) {
    // FIXME: cant use defer reply, because ephemeral cannot be overwritten
    await interaction.deferReply();
    command.run(interaction).catch(ERR);
    return;
  }
};

module.exports.data = {
  name: 'isCommand',
};
