import { Listener, UserError, MessageCommandDeniedPayload } from '@sapphire/framework';
import { loggers } from 'winston';

const logger = loggers.get('global_logger');

export class MessageCommandDeniedListener extends Listener {
  constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ... options,
      event: 'messageCommandDenied'
    });
    
  }

  
  public run(error: UserError, { message }: MessageCommandDeniedPayload) {
    logger.warn(`MessageCommand denied from ${message.author.tag}`)
    return message.reply(`An unknown error occurred.`);
  }
}
