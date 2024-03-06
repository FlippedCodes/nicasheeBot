module.exports.run = async (interaction) => {
  await interaction.deferReply();

  // check if user is teammember
  if (!interaction.member.roles.cache.find(({ id }) => id === config.teamRole)) return messageFail(interaction, 'You don\'t have access to this command! òwó');

  if (interaction.channel.parentId !== config.checkin.categoryID) return messageFail(interaction, 'This channel is not a checkin channel.');
  await client.functions.get('ENGINE_checkin_postReaction').run(interaction);
  messageSuccess(interaction, 'Checkin posted.');
};

module.exports.data = new CmdBuilder()
  .setName('checkin')
  .setDescription('Shows the checkin menu without pinging team.');
