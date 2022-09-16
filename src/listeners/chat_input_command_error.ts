import { Listener, UserError, ChatInputCommandErrorPayload } from '@sapphire/framework';
import { loggers } from 'winston';

const logger = loggers.get('global_logger');

export class ChatInputCommandErrorListener extends Listener {
  constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ... options,
      event: 'chatInputCommandError'
    });
    
  }

  
  public run(error: UserError, { interaction }: ChatInputCommandErrorPayload) {
    logger.error(`ChatInputCommand error: ${error}`)
    return interaction.reply('An unknown error occurred');
  }
}
