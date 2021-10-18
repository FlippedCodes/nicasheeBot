const Path = require('path');

const fs = require('fs');

const files = [];

function getFiles(Directory) {
  fs.readdirSync(Directory).forEach((File) => {
    const Absolute = Path.join(Directory, File);
    if (fs.statSync(Absolute).isDirectory()) return getFiles(Absolute);
    files.push(Absolute);
  });
  return files;
}

module.exports.run = async (client, config) => {
  // get command folder form config
  const commandsFolder = config.setup.moduleFolders.commandsFolder;
  // create empty array to store command submittions
  const commandsSubmit = [];
  // get all command files
  const files = await getFiles(`./${commandsFolder}/`);
  // only get file with .js'
  const jsfiles = files.filter((f) => f.split('.').pop() === 'js');
  const cmdLength = jsfiles.length;
  // check if commands are there
  if (cmdLength <= 0) return console.log(`[${module.exports.help.name}] No command(s) to load!`);
  // announcing command loading
  if (process.env.NODE_ENV === 'development') console.log(`[${module.exports.help.name}] Loading ${cmdLength} command${cmdLength === 1 ? 's' : ''}...`);

  // adding all commands
  await jsfiles.forEach((f, i) => {
    // get module functions and info
    const probs = require(`../${f}`);
    // cleanup name
    const cleanName = f
      .replace(/\\/g, '_')
      .replace(`${commandsFolder}_`, '')
      .replace('.js', '');
    // announcing command loading
    if (process.env.NODE_ENV === 'development') console.log(`[${module.exports.help.name}]     ${i + 1}) Loaded: ${cleanName}!`);
    // adding command to collection
    client.commands.set(cleanName, probs);
    // if not subcommand: adding command to submittion to discord
    if (!probs.data.subcommand) commandsSubmit.push(probs.data.toJSON());
  });
  const registerLength = commandsSubmit.length;

  await console.log(`[${module.exports.help.name}] Loaded ${cmdLength} command${cmdLength === 1 ? 's' : ''}!`);
  await console.log(`[${module.exports.help.name}] Registering ${registerLength} command${registerLength === 1 ? 's' : ''}!`);
  // submit commands to discord api| Dev: one guild only, prod: globaly
  await client.application.commands.set(commandsSubmit, process.env.NODE_ENV === 'development' ? process.env.devGuild : undefined).catch(console.error);
  console.log(`[${module.exports.help.name}] ${registerLength} commands${registerLength === 1 ? 's' : ''} registered!`);
};

module.exports.help = {
  name: 'STARTUP_initCommands',
};
