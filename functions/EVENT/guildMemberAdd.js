module.exports.run = async (member) => {
  if (member.guild.id !== config.guildId) return;

  // hide open channels that are required by discord role request system
  if (config.checkin.hideOpenChannels) await member.roles.add(config.checkin.hideOpenChannels);
};

module.exports.data = {
  name: 'guildMemberAdd',
};
