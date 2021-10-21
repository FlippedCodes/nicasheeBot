global.messageFail = async (interaction, body) => {
  const sentMessage = await client.functions.get('richEmbedMessage')
    .run(interaction, body, '', 16449540, false);
};

module.exports.data = {
  name: 'globalFunc',
};
