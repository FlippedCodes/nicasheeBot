module.exports.run = async (interaction) => {
  if (!interaction.member.roles.cache.has(config.teamRole)) return messageFail(interaction, 'Please wait for a Staffmember to verify you.\nYou can\'t use the buttons.');
  await interaction.deferUpdate();

  const checkinChannel = interaction.channel;

  const userID = checkinChannel.name;
  const member = await interaction.guild.members.fetch(userID);
  config.checkin.checkinRoles.forEach((role) => member.roles.add(role));

  // post welcome message
  const welcomeChannel = member.guild.channels.cache.get(config.checkin.welcomeChannel);
  welcomeChannel.send(`${member}, you have been verified^^!\nPlease have a read of <#730609289504227403>!\nWe can’t wait to have fun with you here!`);
  await client.functions.get('ENGINE_checkin_transcriptChannel').run(checkinChannel);
  // delete channel
  await checkinChannel.delete();
};

module.exports.data = {
  name: 'allow',
};
