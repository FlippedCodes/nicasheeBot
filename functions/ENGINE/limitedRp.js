const { EmbedBuilder } = require('discord.js');

let leaderboardMessage;

let users = [];

async function postLeaderboard(leaderboardChannel) {
  const fields = users
    .sort((a, b) => b.points - a.points)
    // discord field limit
    .slice(0, 25)
    .map((entry) => ({ name: `${entry.id}`, value: `<@${entry.id}>\nPoints: ${entry.points}\nWarning-Level: ${entry.warnLevel}` }));
  const embed = new EmbedBuilder()
    .setFooter({
      text: `Highest warn level is ${config.reducedRP.warnThresholds.length} at ${config.reducedRP.warnThresholds[config.reducedRP.warnThresholds.length - 1]} points.`,
    })
    .setTitle('RP Leaderboard')
    .setColor(users.filter((entry) => entry.warnLevel !== 0).length === 0 ? 'Green' : 'Orange')
    .addFields([...fields]);
  if (!leaderboardMessage) return leaderboardMessage = await leaderboardChannel.send({ embeds: [embed] });
  return leaderboardMessage.edit({ embeds: [embed] });
}

module.exports.run = async (message) => {
  const leaderboardChannel = await client.channels.fetch(config.reducedRP.leaderboardChannel);
  // check messages for all rp messages and convert them to points
  const rpRegex = /(?:\w*)[*_]{1,2}.*?[*_]{1,2}(?:\w*)/gm;
  const findings = message.cleanContent.match(rpRegex);
  // don't do anything when user didn't send a RP message
  if (!findings) return;
  const points = findings.join().length;
  const id = message.author.id;
  const user = users.find((user) => user.id === id);

  // check if there is a user already to add the points to and check warnings.
  if (user) {
    // Checking if user is already level warning 3. If so, delete message.
    if (user.warnLevel === 3) return message.delete();
    user.points += points;
  } else {
    await users.push({
      id,
      points,
      warnLevel: 0,
      timeoutLevel: 0,
      timeouts: [0, 0, 0],
      messageTimeout: 0,
      lastWarnMessage: 0,
      lastPointsDeletion: Date.now(),
    });
  }

  // Update point counts
  users.forEach((user) => {
    const activeUser = users.find((userTemp) => userTemp.id === user.id);

    // check how often the deletion time fits into lastPointsDeletion
    const difference = Date.now() - user.lastPointsDeletion;
    const points = Math.round(difference / config.reducedRP.pointsDeletionTime);
    // remove that amount of points
    activeUser.points -= points;
    // check if points go into negative and delete entire entry and return
    if (Math.sign(activeUser.points) === -1) return users = users.filter((userTemp) => userTemp.id !== user.id);
    // DEPRECATED: if points drop under threshold, reset warn
    // if (activeUser.points < config.reducedRP.warnThreshold) activeUser.warned = false;

    // set warn levels
    config.reducedRP.warnThresholds.forEach(async (threshold, i) => {
      // add warn level
      if (activeUser.points >= threshold) {
        // only step one warn at the time
        if (activeUser.warnLevel >= (i + 1)) return true;
        // overflow protection
        if (activeUser.warnLevel === config.reducedRP.warnThresholds.length) return true;
        activeUser.warnLevel += 1;
        // reset points to warn threshold, so it fair and user goes through each stage
        activeUser.points = config.reducedRP.warnThresholds[activeUser.warnLevel - 1];
        // Checking the level of latest warning that has been made to the user
        if (activeUser.timeoutLevel >= activeUser.warnLevel) {
          // Removing the timeout to lower the timeoutLevel variable
          clearTimeout(activeUser.timeouts[activeUser.warnLevel - 1]);
          return false;
        }
        activeUser.timeoutLevel++;

        // Posting the warning for a specific user
        const colors = ['Orange', 'Red', 'NotQuiteBlack'];
        const warningEmbed = new EmbedBuilder()
          .setTitle('Warning level reached')
          .setDescription(`<@${activeUser.id}> you reached warning level ${activeUser.warnLevel}!
${config.reducedRP.warnThresholds.length === activeUser.warnLevel ? '(No RP anymore for now)' : ''}`)
          .setColor(colors[activeUser.timeoutLevel - 1])
          .setFooter({ text: `No repercussion, just unable to send RP posts at warning level ${config.reducedRP.warnThresholds.length}!` });

        // If there is still a message warning the user that hasn't been deleted yet, we delete it to replace it with a new one
        if (activeUser.lastWarnMessage) {
          activeUser.lastWarnMessage.delete();
          activeUser.lastWarnMessage = null;
          clearTimeout(activeUser.messageTimeout);
        }

        // Message to warn the user
        activeUser.lastWarnMessage = await leaderboardChannel.send({ content: `<@${activeUser.id}>`, embeds: [warningEmbed], ephemeral: true });
        activeUser.messageTimeout = setTimeout(() => {
          activeUser.lastWarnMessage.delete();
          activeUser.lastWarnMessage = null;
        }, config.reducedRP.warnMessageDeletionTime * 60E3);
        return false;
      }
      if (activeUser.warnLevel === (i + 1)) {
        // underflow protection
        if (activeUser.warnLevel === 0) return false;
        activeUser.warnLevel -= 1;
        // Leaving some time before counting the decreasing level to avoid spamming warnings in case score goes up and down
        activeUser.timeouts[activeUser.warnLevel] = setTimeout(() => activeUser.timeoutLevel--, config.reducedRP.warnMessageCooldown * 60E3);
        return false;
      }
      return true;
    });

    // update lastPointsDeletion when points where adjusted
    if (points !== 0) activeUser.lastPointsDeletion = Date.now();
  });
  await postLeaderboard(leaderboardChannel);
};

module.exports.help = {
  name: 'limitedRp',
};
