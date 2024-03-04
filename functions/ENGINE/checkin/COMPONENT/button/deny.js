const { EmbedBuilder } = require('discord.js');

const embed = new EmbedBuilder()
  .setTitle('Check-in declined')
  .setDescription('It seems like your check-in got declined or you exceed your stay with not replying back.')
  .setColor('Red');

module.exports.run = async (interaction) => {
  await interaction.deferUpdate();

  const checkinChannel = interaction.channel;
  const userID = checkinChannel.name;
  const user = await interaction.guild.members.fetch(userID);
  user.send({ embeds: [embed] }).catch((e) => null);

  await client.functions.get('ENGINE_checkin_transcriptChannel').run(checkinChannel);

  await user.kick('Checkin Denied');
  // channel deletion is handled in member remove event
};

module.exports.data = {
  name: 'deny',
};
