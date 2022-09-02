const { EmbedBuilder } = require('discord.js');

const embed = new EmbedBuilder()
  .setTitle('Check-in declined')
  .setDescription('It seems like your check-in got declined or you exceed your stay with not replying back.')
  .setColor('Red');

module.exports.run = async (interaction) => {
  await interaction.deferUpdate();

  const checkinChannel = interaction.channel;
  const userID = checkinChannel.name;
  const user = await client.users.fetch(userID);
  await user.send({ embeds: [embed] });

  await client.functions.get('ENGINE_checkin_transcriptChannel').run(checkinChannel);
  // delete channel
  await checkinChannel.delete();
};

module.exports.data = {
  name: 'deny',
};
