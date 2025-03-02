module.exports.run = async (message) => {
  // return if unwanted
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;

  // checking if staffmember
  // TODO: foreach, with more roles
  // const staff = message.member.roles.cache.has(config.teamRole);

  // check if channel channel is a limited RP zone
  if (!DEBUG && config.reducedRP && config.reducedRP.channels.includes(message.channel.id)) return client.functions.get('ENGINE_limitedRp').run(message);
  // if (config.reducedRP.channels.includes(message.channel.id)) return client.functions.get('ENGINE_limitedRp').run(message);

  // non command function: checkin complete questioning Reaction adding
  if (message.mentions.roles.has(config.teamRole)
  && message.channel.parentId === config.checkin.categoryID) return client.functions.get('ENGINE_checkin_postReaction').run(message);
};

module.exports.data = {
  name: 'messageCreate',
};
