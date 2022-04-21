import { Message } from 'discord.js';
import { loggers } from 'winston';

const logger = loggers.get('global_logger');

export function unknown(msg: Message, params: Array<string>) {
  logger.info(`Sent response after receiving an unknown message`);
  logger.verbose(`Response was to ${msg.author.tag} in ${msg.channel.type} ` +
    `channel ${msg.channel.id}`);

  msg.reply(`OK ${msg.author} I do not even know what you are saying (type ~help for help)`);
}
