global.messageFail = async (interaction, body, color) => {
  const sentMessage = await client.functions.get('richEmbedMessage')
    .run(interaction, body, '', color || 16449540, false, true);
};

global.messageSuccess = async (interaction, body, color) => {
  const sentMessage = await client.functions.get('richEmbedMessage')
    .run(interaction, body, '', color || 4296754, false, false);
  return sentMessage;
};

global.prettyCheck = (question) => {
  if (question) return '✅';
  return '❌';
};

module.exports.data = {
  name: 'globalFunc',
};
