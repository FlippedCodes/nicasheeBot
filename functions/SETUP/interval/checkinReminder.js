const Handlebars = require('handlebars');

const moment = require('moment');

const { EmbedBuilder } = require('discord.js');

function sendWarning(message, amount) {
  const warningText = Handlebars.compile(config.checkin.reminders.warningText);
  const body = warningText({ day: amount, grammarDay: amount === 1 ? '' : 's' });
  const embed = new EmbedBuilder()
    .setDescription(body)
    .setTitle(config.checkin.reminders.warningTitle)
    .setColor('Orange');
  return message.channel.send({ content: `<@${message.channel.name}>`, embeds: [embed] });
}

module.exports.run = async () => {
  // do not use, when not defined
  if (!config.checkin.reminders) return;
  console.log(`[${module.exports.data.name}] Starting checkin cleanup interval...`);
  // setup loop
  setInterval(async () => {
    // get current channel list
    const checkinCategory = await client.channels.cache.get(config.checkin.categoryID);
    const channels = await checkinCategory.children.cache;
    // loop through channel list
    channels.filter((channel) => !config.checkin.ignoreChannels.includes(channel.id)).forEach(async (channel) => {
      // get latest message
      // WA cause #lastMessage is null
      const latestMassage = await channel.messages.fetch(channel.lastMessageId);
      // check if old enough
      if (moment(latestMassage.createdTimestamp).isAfter(moment().subtract(config.checkin.reminders.reminderIntervalHours, 'hours'))) return;
      // if message is by team member, send warning, with max amount
      // WO latestMassage.member is null
      const sender = await channel.guild.members.fetch(latestMassage.author.id);
      if (sender.roles.cache.has(config.teamRole)) return sendWarning(latestMassage, config.checkin.reminders.reminderAmount);
      // if from out bot
      if (latestMassage.author.id !== client.user.id) return;
      // check, if it has the correct embed
      if (!latestMassage.embeds.length) return sendWarning(latestMassage, config.checkin.reminders.reminderAmount);
      const embed = latestMassage.embeds.pop();
      if (embed.title !== config.checkin.reminders.warningTitle) return;
      // check, what reminder integer it is sitting at
      const currentDays = embed.description.split(' ').filter((content) => !isNaN(content))[0];
      // reduce by one
      const futureDays = currentDays - 1;
      // check if 0 and close channel
      if (!futureDays) return client.functions.get('ENGINE_checkin_COMPONENT_button_deny').run(latestMassage, true);
      // resend message with updated counter
      return sendWarning(latestMassage, futureDays);
    });
  }, moment.duration(config.checkin.reminders.checkIntervalHours, 'hours').asMilliseconds());
};

module.exports.data = {
  name: 'checkinReminder',
  callOn: '-',
};
