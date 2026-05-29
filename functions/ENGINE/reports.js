const {
  ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ThreadAutoArchiveDuration, ChannelType,
} = require('discord.js');

const moment = require('moment');

const consent = new TextInputBuilder()
  .setCustomId('reports_COMPONENT_modalResponse_consent')
  .setRequired(true)
  .setMinLength(3)
  .setMaxLength(3)
  .setLabel('Not abusing the system?')
  .setPlaceholder('Type "yes", if you understand that abusing the system will result in punishment.')
  .setStyle(TextInputStyle.Short);

const meet = new TextInputBuilder()
  .setCustomId('reports_COMPONENT_modalResponse_meet')
  .setRequired(true)
  .setLabel('At which Furbulous meet did your incident happen.')
  .setStyle(TextInputStyle.Short);

const suggestion = new TextInputBuilder()
  .setCustomId('reports_COMPONENT_modalResponse_suggestion')
  .setRequired(true)
  .setLabel('Let us know what is on your mind.')
  .setStyle(TextInputStyle.Paragraph);

const reason = new TextInputBuilder()
  .setCustomId('reports_COMPONENT_modalResponse_reason')
  .setRequired(true)
  .setLabel('What is your reason for the report?')
  .setPlaceholder('Let us know in detail, who and what you want to report.')
  .setStyle(TextInputStyle.Paragraph);

const messageLink = new TextInputBuilder()
  .setCustomId('reports_COMPONENT_modalResponse_messageLink')
  .setRequired(true)
  .setMinLength(15)
  .setMaxLength(200)
  .setLabel('Please provide a message link.')
  .setPlaceholder('If the message was deleted, give us a message link nearby.')
  .setStyle(TextInputStyle.Short);

const voiceChannel = new TextInputBuilder()
  .setCustomId('reports_COMPONENT_modalResponse_voiceChannel')
  .setRequired(true)
  .setLabel('Which voice channel did it happen in?')
  .setPlaceholder('Let us know which voice channel this happened in.')
  .setStyle(TextInputStyle.Short);

const refUsers = new TextInputBuilder()
  .setCustomId('reports_COMPONENT_modalResponse_refUsers')
  .setRequired(false)
  .setLabel('Who else was there?')
  .setPlaceholder('Where there any additional witnesses, you would like to add?')
  .setStyle(TextInputStyle.Short);

module.exports.run = async (interaction) => {
  const reportType = interaction.values[0];
  const modal = new ModalBuilder()
    .setCustomId(interaction.id)
    .setTitle('New Ticket');
  modal.addComponents([new ActionRowBuilder().addComponents(consent)]);
  switch (reportType) {
    case 'userText':
      modal.addComponents([new ActionRowBuilder().addComponents(messageLink)]);
      break;
    case 'userMeet':
      modal.addComponents([new ActionRowBuilder().addComponents(meet)]);
      break;
    case 'suggestion':
      modal.addComponents([new ActionRowBuilder().addComponents(suggestion)]);
      break;
    case 'userVC':
      modal.addComponents([new ActionRowBuilder().addComponents(voiceChannel)]);
      break;
    case 'moderator':
      modal.addComponents([new ActionRowBuilder().addComponents(messageLink)]);
      break;
    case 'admin':
      const replyMessage = await messageSuccess(interaction, 'Please DM an admin or a owner directly.\nThere is no way reasonable way to handle this with this system.');
      return setTimeout(() => replyMessage.delete(), 10000);
    default:
      return 'Unknown type';
  }
  modal.addComponents([new ActionRowBuilder().addComponents(reason)]);
  modal.addComponents([new ActionRowBuilder().addComponents(refUsers)]);
  await interaction.showModal(modal);

  const roleMembers = reportType === 'moderator' ? `<@&${config.ownerRole}>` : `<@&${config.teamRole}>`;
  const body = [`### Relevant for\n> ${roleMembers}`, `### Opened by\n> ${interaction.member}`, `### Report type\n> ${reportType}`];

  const filter = (i) => interaction.id === i.customId;
  interaction.awaitModalSubmit({ time: 900_000, filter })
    .then(async (interactionAnswer) => {
      interactionAnswer.deferUpdate();
      const userAnswers = interactionAnswer.fields.fields.map((field) => {
        const label = [consent, meet, suggestion, messageLink, voiceChannel, reason, refUsers].find((question) => question.data.custom_id === field.customId).data.label;
        const value = field.value.replaceAll('\n', '\n> ');
        return { label, value };
      });
      const thread = await interaction.channel.threads.create({
        name: interactionAnswer.id,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
        type: ChannelType.PrivateThread,
      });
      body.push(...userAnswers.filter((entry) => entry.value).map((question) => `### ${question.label}\n> ${question.value}`));
      thread.send(body.join('\n'));
    })
    .catch((err) => null);
};

module.exports.data = {
  name: 'reportOpened',
};
