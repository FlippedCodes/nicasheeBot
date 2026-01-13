module.exports.run = async (memberOld, memberNew) => {
  // FIXME: Fires twice for some reason. and cant be fixed
  const checkedIn = await memberNew.roles.cache.find(({ id }) => id === config.checkin.checkinRole);
  if (!checkedIn && config.checkin.hideOpenChannels) return memberNew.roles.set([config.checkin.hideOpenChannels]);
};

module.exports.data = {
  name: 'guildMemberUpdate',
};
