import { FADI_PASTA, HELP_TEXT, FADI_SECRETARY_URL } from './const.js';
import Discord from 'discord.js';

export function fuckTyler(msg, params, logger) {
  logger.info(`Sent a message saying fuck Tyler`);
  logger.verbose(`Response was to ${msg.author.tag} in ${msg.channel.type} `,
    `channel ${msg.channel.id}`);

  msg.channel.send('Yo fuck Tyler');
}

export function unknown(msg, params, logger) {
  logger.info(`Sent response after receiving an unknown message`);
  logger.verbose(`Response was to ${msg.author.tag} in ${msg.channel.type} ` +
    `channel ${msg.channel.id}`);

  msg.channel.send(`OK ${msg.author} I do not even know what you are saying`);
}


export function pizza(msg, params, logger) {
  logger.info('Sent Fadi Copypasta');
  logger.verbose(`Response was to ${msg.author.tag} in ${msg.channel.type} `,
    `channel ${msg.channel.id}`);

  msg.channel.send(FADI_PASTA);
}

export function help(msg, params, logger) {
  logger.info('Sent help');
  logger.verbose(`Response was to ${msg.author.tag} in ${msg.channel.type} `,
    `channel ${msg.channel.id}`);

  msg.channel.send(HELP_TEXT);
}

export function voteForFadi(msg, params, logger) {
  logger.info('Sent Fadi campaign poster');
  logger.verbose(`Response was to ${msg.author.tag} in ${msg.channel.type} `,
    `channel ${msg.channel.id}`);
  let attachment = new Discord.MessageAttachment(FADI_SECRETARY_URL);
  msg.channel.send({
    files: [FADI_SECRETARY_URL]
  });
}
