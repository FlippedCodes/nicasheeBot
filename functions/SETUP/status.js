module.exports.run = async () => {
  if (DEBUG) return;
  console.log(`[${module.exports.data.name}] Setting status...`);
  console.log(`[${module.exports.data.name}] Status set!`);
};

module.exports.data = {
  name: 'status',
  callOn: 'setup',
};
