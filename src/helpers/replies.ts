import { Message } from 'discord.js';
import { loggers } from 'winston';

const logger = loggers.get('global_logger');

export function unknown(message: Message) {
  logger.info(`Sent response after receiving an unknown message`);
  logger.verbose(`Response was to ${message.author.tag} in ${message.channel.type} ` +
    `channel ${message.channel.id}`);

  return (`OK ${message.author} I do not even know what you are saying (type ~help for help)`);
}
