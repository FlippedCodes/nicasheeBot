const userDoB = require('../../database/models/UserDoB');

function sendMessage(EmbedBuilder, interaction, userTag, userID, allow, teammemberTag, serverName) {
  // needs to be local as settings overlap from different embed-requests
  const embed = new EmbedBuilder();

  let color = 16741376;
  if (allow) color = 4296754;

  embed
    .setColor(color)
    .setDescription(`${userTag} got added to the DB!`)
    .addFields([
      { name: 'ID', value: userID, inline: true },
      { name: 'Allow', value: prettyCheck(allow), inline: true },
      { name: 'Created by', value: teammemberTag, inline: true },
      { name: 'Created on', value: serverName, inline: true },
    ]);

  const content = { embeds: [embed] };
  // send feedback
  reply(interaction, content);
  // send in log
  interaction.guild.channels.cache.find(({ id }) => id === config.DoBchecking.logChannelID).send(content);
}

async function addUser(ID, allow, teammemberID, serverID) {
  if (await userDoB.findOne({ where: { ID } }).catch(ERR)) return false;
  await userDoB.findOrCreate({ where: { ID }, defaults: { allow, teammemberID, serverID } }).catch(ERR);
  return true;
}

function getAge(moment, DoB) {
  const age = moment().diff(DoB, 'years');
  return age;
}

module.exports.run = async (interaction, moment, EmbedBuilder) => {
  const command = interaction.options;
  // get user and ID
  const user = command.getUser('user', true);
  const userID = user.id;
  // get date
  const date = moment(command.getString('date', true), config.DoBchecking.dateFormats, false);
  // validate date
  if (!date.isValid()) return messageFail(interaction, 'Your provided DoB is not a date!');
  // get age and set allow
  const age = getAge(moment, date);
  if (age <= 18) return messageFail(interaction, 'You can only add users that are over 18.');
  const allow = false;
  // add entry
  const added = await addUser(userID, allow, interaction.user.id, interaction.guild.id);
  // report to user if entry added
  if (added) {
    // send log and user confirmation
    sendMessage(EmbedBuilder, interaction, user.tag, userID, allow, interaction.user.tag, interaction.guild.name);
  } else {
    messageFail(interaction, 'Entry already exists. Update it with the change command.');
  }
};

module.exports.data = { subcommand: true };
