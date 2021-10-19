module.exports.run = async () => {
  if (DEBUG) return;
  console.log(`[${module.exports.help.name}] Setting status...`);
  client.user.setStatus('online');
  const membercount = client.guilds.cache.reduce((previousCount, currentGuild) => previousCount + currentGuild.memberCount, 0);
  client.user.setActivity(`${membercount} members in VoreNetwork`, { type: 'WATCHING' })
    .then(() => console.log(`[${module.exports.help.name}] Status set!`));
};

module.exports.help = {
  name: 'status',
  callOn: 'setup',
};
