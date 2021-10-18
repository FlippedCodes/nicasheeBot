module.exports.run = (client, fs, config) => {
  const commandsFolder = config.setup.moduleFolders.commandsFolder;

  const commandsSubmit = [];

  // read directory with commands
  fs.readdir(`./${commandsFolder}`, async (err, files) => {
    // error if fails
    if (err) console.error(err);

    // removal of '.js' in the end of the file
    const jsfiles = files.filter((f) => f.split('.').pop() === 'js');

    // check if commands are there
    if (jsfiles.length <= 0) return console.log(`[${module.exports.help.name}] No command(s) to load!`);

    // announcing command loading
    if (process.env.NODE_ENV === 'development') console.log(`[${module.exports.help.name}] Loading ${jsfiles.length} command${jsfiles.length === 1 ? 's' : ''}...`);

    // adding all commands
    await jsfiles.forEach((f, i) => {
      const probs = require(`../${commandsFolder}/${f}`);
      // announcing command loading
      if (process.env.NODE_ENV === 'development') console.log(`[${module.exports.help.name}]     ${i + 1}) Loaded: ${f}!`);
      // adding command to collection
      client.commands.set(probs.data.name, probs);
      // adding command to submittion to discord
      commandsSubmit.push(probs.data.toJSON());
    });

    await console.log(`[${module.exports.help.name}] Loaded ${jsfiles.length} command${jsfiles.length === 1 ? 's' : ''}!`);
    await console.log(`[${module.exports.help.name}] Registering ${jsfiles.length} command${jsfiles.length === 1 ? 's' : ''}!`);
    await client.application.commands.set(commandsSubmit, process.env.NODE_ENV === 'development' ? process.env.devGuild : undefined).catch(console.error);
    console.log(`[${module.exports.help.name}] ${jsfiles.length} commands${jsfiles.length === 1 ? 's' : ''} registered!`);
  });
};

module.exports.help = {
  name: 'STARTUP_initCommands',
};
