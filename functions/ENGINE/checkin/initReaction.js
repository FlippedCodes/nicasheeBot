const welcomeMessage = (userID) => `
Haiii <@!${userID}>! Welcome to Devoravore. <:nicshahappy:921955441066508350>
Before we let you in I’m going to ask you some questions^^!

1. Where did you get your invite?
2. Are you interested in the vore and the furry/scalie communities?
3. What is your Date of Birth? (Make sure your DoB is written in the DD/MM/YYYY format.)
4. Have you read, and do you agree to, all of the <#730609289504227400>?

When you’ve answered these questions please ping the \`@Moderation\` role **once** and a staff member will be with you shortly to complete your verification.
`;

// calculate user creation
function calcUserAge(user) {
  const currentDate = new Date();
  const creationDate = new Date(user.createdAt);
  const msDiff = Math.abs(currentDate - creationDate);
  return Math.ceil(msDiff / (1000 * 60 * 60 * 24));
}

async function createChannel(guild, user, topic) {
  const channel = await guild.channels.create({ name: user.id, topic, parent: config.checkin.categoryID }).catch(ERR);
  await channel.lockPermissions().catch(ERR);
  // needs to be delayed, because API limit causes permissions to be set in reverse order.
  setTimeout(async () => {
    await channel.permissionOverwrites.edit(user.id, { ViewChannel: true }).catch(ERR);
    await channel.send(welcomeMessage(user.id)).catch(ERR);
  }, 3 * 1000);
}


module.exports.run = async (reaction) => {
  if (DEBUG) return;
  // check emoji and channel
  const configReaction = config.checkin.reaction;
  if (reaction.member.roles.length !== 0) return;
  if (reaction.channel_id !== configReaction.channel) return;
  if (reaction.message_id !== configReaction.message) return;
  if (reaction.emoji.name !== configReaction.emoji) return;
  // get guild and user
  const guild = await client.guilds.cache.find((guild) => guild.id === reaction.guild_id);
  const user = await client.users.fetch(reaction.member.user.id, false);
  // check if user already has checkin channel
  const checkinChannel = await guild.channels.cache.find((channel) => channel.name === user.id);
  if (!checkinChannel) {
    const dayDiff = calcUserAge(user);
    // TODO: add DB table to check if user was in guild before
    // Create channel, set settings and edit channel topic
    const topic = `
    Username: ${user.tag}
    Avatar: ${user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}
    Days since creation: ${dayDiff};
    Creation date: ${user.createdAt}`;
    await createChannel(guild, user, topic);
  }
  // remvove user reaction
  const reactionChannel = await guild.channels.cache.get(config.checkin.reaction.channel);
  const reactionMessage = await reactionChannel.messages.fetch(config.checkin.reaction.message);
  const initalReaction = await reactionMessage.reactions.cache.get(config.checkin.reaction.emoji);
  initalReaction.users.remove(user);
};

module.exports.help = {
  name: 'initReaction',
};
