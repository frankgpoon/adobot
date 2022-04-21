import { Args, Command, CommandContext } from '@sapphire/framework';
import { Message } from 'discord.js';

import { loggers } from 'winston';
const logger = loggers.get('global_logger');

export class FuckTylerCommand extends Command {
  
  constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'ft',
      description: 'Fuck tyler'
    });
  }

  messageRun(message: Message<boolean>) {
    logger.info(`Sent a message saying fuck Tyler`);
    logger.verbose(`Response was to ${message.author.tag} in ${message.channel.type} `,
      `channel ${message.channel.id}`);

    return message.channel.send('Yo fuck Tyler');
  }
}