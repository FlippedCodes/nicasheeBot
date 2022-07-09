module.exports.run = async (reaction, user) => {
  if (user.bot) return;

  // checkin
  client.functions.get('ENGINE_checkin_completedReaction').run(reaction, user);
};

module.exports.data = {
  name: 'messageReactionAdd',
};
