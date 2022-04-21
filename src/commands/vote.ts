import { Args, Command, CommandContext } from '@sapphire/framework';
import { Message } from 'discord.js';
import { FADI_SECRETARY_URL } from '../const';

import { loggers } from 'winston';
const logger = loggers.get('global_logger');

export class VoteCommand extends Command {
  constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'vote',
      description: 'I will do anything necessary to improve this school'
    });
  }

  messageRun(message: Message<boolean>) {
    logger.info('Sent Fadi campaign poster');
    logger.verbose(`Response was to ${message.author.tag} in ${message.channel.type} `,
      `channel ${message.channel.id}`);
    message.channel.send({
      files: [FADI_SECRETARY_URL]
    });
  }
}