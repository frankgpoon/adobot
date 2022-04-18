import { FADI_PASTA, HELP_TEXT, FADI_SECRETARY_URL } from './const.js';
import { Message, MessageAttachment } from 'discord.js';
import { loggers } from 'winston';

const logger = loggers.get('global_logger');


export function fuckTyler(msg: Message, params: Array<string>) {
  logger.info(`Sent a message saying fuck Tyler`);
  logger.verbose(`Response was to ${msg.author.tag} in ${msg.channel.type} `,
    `channel ${msg.channel.id}`);

  msg.channel.send('Yo fuck Tyler');
}

export function unknown(msg: Message, params: Array<string>) {
  logger.info(`Sent response after receiving an unknown message`);
  logger.verbose(`Response was to ${msg.author.tag} in ${msg.channel.type} ` +
    `channel ${msg.channel.id}`);

  msg.reply(`OK ${msg.author} I do not even know what you are saying (type ~help for help)`);
}


export function pizza(msg: Message, params: Array<string>) {
  logger.info('Sent Fadi Copypasta');
  logger.verbose(`Response was to ${msg.author.tag} in ${msg.channel.type} `,
    `channel ${msg.channel.id}`);

  msg.channel.send(FADI_PASTA);
}

export function help(msg: Message, params: Array<string>) {
  logger.info('Sent help');
  logger.verbose(`Response was to ${msg.author.tag} in ${msg.channel.type} `,
    `channel ${msg.channel.id}`);

  msg.channel.send(HELP_TEXT);
}

export function voteForFadi(msg: Message, params: Array<string>) {
  logger.info('Sent Fadi campaign poster');
  logger.verbose(`Response was to ${msg.author.tag} in ${msg.channel.type} `,
    `channel ${msg.channel.id}`);
  let attachment = new MessageAttachment(FADI_SECRETARY_URL);
  msg.channel.send({
    files: [FADI_SECRETARY_URL]
  });
}
