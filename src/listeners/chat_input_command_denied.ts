import { Listener, UserError, ChatInputCommandDeniedPayload } from '@sapphire/framework';
import { loggers } from 'winston';

const logger = loggers.get('global_logger');

export class ChatInputCommandDeniedListener extends Listener {
  constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ... options,
      event: 'chatInputCommandDenied'
    });
    
  }

  
  public run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
    logger.warn('chat denied listener')
    return interaction.reply(error.message);
  }
}
