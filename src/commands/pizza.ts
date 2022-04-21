import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';
import { FADI_PASTA } from '../const';

import { loggers } from 'winston';
const logger = loggers.get('global_logger');

export class PizzaCommand extends Command {
  
  constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'pizza',
      description: 'The infamous Fadi copypasta'
    });
  }

  messageRun(message: Message<boolean>) {
    logger.info('Sent Fadi Copypasta');
    logger.verbose(`Response was to ${message.author.tag} in ${message.channel.type} `,
      `channel ${message.channel.id}`);

    message.channel.send(FADI_PASTA);
  }
}