export function fuckTyler(msg, params, logger) {
  logger.info(`Sent a message saying fuck Tyler`);
  logger.info(`  Response was to ${msg.author.tag} in ${msg.channel.type} `,
    `channel ${msg.channel.id}`);
  msg.channel.send('Yo fuck Tyler');
}

export function unknown(msg, params, logger) {
  logger.info(`Sent response after receiving an unknown message`);
  logger.info(`  Response was to ${msg.author.tag} in ${msg.channel.type} `,
    `channel ${msg.channel.id}`);
  msg.channel.send(`OK ${msg.author} I do not even know what you are saying`);
}

import { FADI_PASTA } from './const.js';

export function fadi(msg, params, logger) {
  logger.info('Sent Fadi Copypasta');
  logger.info(`  Response was to ${msg.author.tag} in ${msg.channel.type} `,
    `channel ${msg.channel.id}`);
  msg.channel.send(FADI_PASTA);
}