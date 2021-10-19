module.exports.run = async (interaction) => {

};

module.exports.data = new CmdBuilder()
  .setName('nsfw')
  .setDescription('Manages nsfw access.')
  .addSubcommand((subcommand) => subcommand
    .setName('add')
    .setDescription('Adds an entry.')
    .addUserOption((option) => option.setName('user').setDescription('Provide a user to to add.').setRequired(true))
    .addStringOption((option) => option.setName('date').setDescription('Provide the users DoB.').setRequired(true)))
  .addSubcommand((subcommand) => subcommand
    .setName('allow')
    .setDescription('Allow access to nsfw rooms.')
    .addUserOption((option) => option.setName('user').setDescription('Provide a user to to edit.').setRequired(true))
    .addBooleanOption((option) => option.setName('allow').setDescription('Set the allowance.').setRequired(true)))
  .addSubcommand((subcommand) => subcommand
    .setName('change')
    .setDescription('Change the DoB of an entry.')
    .addUserOption((option) => option.setName('user').setDescription('Provide a user to to add.').setRequired(true))
    .addStringOption((option) => option.setName('date').setDescription('Provide the users DoB.').setRequired(true)))
  .addSubcommand((subcommand) => subcommand
    .setName('search')
    .setDescription('Search an entry.')
    .addUserOption((option) => option.setName('user').setDescription('Provide a user to to add.').setRequired(true)))
  .addSubcommand((subcommand) => subcommand
    .setName('calc')
    .setDescription('Calcupate the age from a DoB')
    .addStringOption((option) => option.setName('date').setDescription('Provide the users DoB.').setRequired(true)));
