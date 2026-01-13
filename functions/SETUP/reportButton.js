const {
  EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
} = require('discord.js');

const select = new ActionRowBuilder()
  .addComponents([
    new StringSelectMenuBuilder()
      .setCustomId('reports')
      .setPlaceholder('Open Report')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('User in text')
          .setEmoji('🔤')
          .setDescription('I want to report something happened in text.')
          .setValue('userText'),
        new StringSelectMenuOptionBuilder()
          .setLabel('User in DMs')
          .setEmoji('📨')
          .setDescription('I want to report a user in my DMs.')
          .setValue('userDM'),
        new StringSelectMenuOptionBuilder()
          .setLabel('User in voice')
          .setEmoji('🔊')
          .setDescription('I want to report something happened in a voice chat.')
          .setValue('userVC'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Moderation')
          .setEmoji('🛡️')
          .setDescription('I feel im being treated unfairly by a moderator.')
          .setValue('moderator'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Admin or Owner')
          .setEmoji('💀')
          .setDescription('I feel im being treated unfairly by an admin or the owner.')
          .setValue('admin'),
      ),
  ]);

module.exports.run = async () => {
  if (DEBUG) return;
  console.log(`[${module.exports.data.name}] Posting report button message`);
  const reportChannel = await client.channels.fetch(config.reportManager.channelID);
  await reportChannel.bulkDelete(1).catch(ERR);
  const embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('Report System')
    .setDescription('Hello!\nIn this channel, we manage our user reports. If you want to open up a report, you may use the selection menu below for the right form.\n**If applicable, make sure you have a message link ready!**')
    .setFooter({ text: 'One issue per ticket! Abuse of the report system will result in punishment!' });
  reportChannel.send({ embeds: [embed], components: [select] });
};

module.exports.data = {
  name: 'reportButton',
  callOn: 'setup',
};
