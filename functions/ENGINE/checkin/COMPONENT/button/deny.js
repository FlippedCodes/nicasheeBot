const { EmbedBuilder } = require('discord.js');

const embed = new EmbedBuilder()
  .setTitle('Check-in declined')
  .setDescription('It seems like your check-in got declined or you exceed your stay with not replying back.')
  .setColor('Red');

module.exports.run = async (interaction) => {
  if (!interaction.member.roles.cache.has(config.teamRole)) return messageFail(interaction, 'Please wait for a Staffmember to verify you.\nYou can\'t use the buttons.');
  await interaction.deferUpdate();

  const checkinChannel = interaction.channel;
  const userID = checkinChannel.name;
  const user = await interaction.guild.members.fetch(userID).catch((e) => null);
  if (user) {
    user.send({ embeds: [embed] }).catch((e) => null);
    await user.kick('Checkin Denied');
    // channel deletion is handled in member remove event. But if user has already left, channel needs to be deleted
  } else {
    await client.functions.get('ENGINE_checkin_transcriptChannel').run(checkinChannel);
    checkinChannel.delete();
  }
};

module.exports.data = {
  name: 'deny',
};
