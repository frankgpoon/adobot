import { Args, Command, CommandContext } from '@sapphire/framework';
import { Message } from 'discord.js';
import { HELP_TEXT } from '../const';

import { loggers } from 'winston';
const logger = loggers.get('global_logger');

export class HelpCommand extends Command {
  constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'help',
      aliases: ['?'],
      description: 'Displays a help message'
    });
  }

  messageRun(message: Message<boolean>) {
    logger.info('Sent help');
    logger.verbose(`Response was to ${message.author.tag} in ${message.channel.type} `,
      `channel ${message.channel.id}`);

    message.channel.send(HELP_TEXT);
  }
}