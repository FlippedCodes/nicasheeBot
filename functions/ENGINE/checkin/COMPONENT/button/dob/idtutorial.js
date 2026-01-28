module.exports.run = async (interaction) => {
  if (!interaction.member.roles.cache.has(config.teamRole)) return messageFail(interaction, 'Please wait for a staff member to verify you.\nYou can\'t use the buttons.');
  if (interaction.channel.parentId !== config.checkin.categoryID) return messageFail(interaction, 'This channel is not a check-in channel.');

  if (!config.checkin.idTutorial) return messageFail(interaction, 'Instructions not setup! Ask phil about it, if needed.', undefined, true);

  // remove user reaction
  const channel = await interaction.guild.channels.cache.get(config.checkin.idTutorial.channel);
  const message = await channel.messages.fetch(config.checkin.idTutorial.message);
  const index = config.checkin.idTutorial.titleIndex;
  const searchString = config.checkin.idTutorial.searchString;
  const content = `<@${interaction.channel.name}>\n\n${index !== null ? `${searchString}${message.content.split(searchString)[index]}` : message.content}`;

  interaction.channel.send(content);
  messageSuccess(interaction, 'Instructions sent.', undefined, true);
};

module.exports.data = {
  name: 'idtutorial',
};
