const userDoB = require('../../database/models/UserDoB');

async function searchUser(ID) {
  const result = await userDoB.findOne({ where: { ID } }).catch(ERR);
  return result;
}

function sendMessage(EmbedBuilder, interaction, userTag, userID, allow, teammemberTag, serverName, updated, created) {
  let color = 16741376;
  if (allow) color = 4296754;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`${userTag}`)
    .addFields([
      { name: 'ID', value: userID, inline: true },
      { name: 'Allow', value: prettyCheck(allow), inline: true },
      { name: 'Created by', value: teammemberTag, inline: true },
      { name: 'Created on', value: serverName, inline: true },
      { name: 'Created at', value: created, inline: false },
      { name: 'Updated at', value: updated, inline: false },
    ]);

  // send message
  reply(interaction, { embeds: [embed] });
}

module.exports.run = async (interaction, moment, EmbedBuilder) => {
  const command = interaction.options;
  // get user and ID
  const user = command.getUser('user', true);
  const userID = user.id;
  // search entry
  const DBentry = await searchUser(userID);
  // report to user if entry added
  if (!DBentry) return messageFail(interaction, `No data found for the ID \`${userID}\` (\`${user.tag}\`)!`);
  // get user tags and format dates
  const teammember = await client.users.fetch(DBentry.teammemberID);
  const teammemberTag = teammember ? teammember.tag : 'none';
  const serverName = DBentry.serverID ? client.guilds.cache.find(({ id }) => id === DBentry.serverID).name : 'unknown';
  const [updatedAt, createdAt] = [DBentry.updatedAt, DBentry.createdAt].map((date) => moment(date).format('ddd, MMM Do YYYY, h:mm a'));
  // send it
  sendMessage(EmbedBuilder, interaction, user.tag, userID, DBentry.allow, teammemberTag, serverName, updatedAt, createdAt);
};

module.exports.data = { subcommand: true };
