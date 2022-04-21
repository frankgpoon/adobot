import { Listener, UserError, CommandDeniedPayload } from '@sapphire/framework';
import { loggers } from 'winston';

const logger = loggers.get('global_logger');

export class CommandDeniedListener extends Listener {
  constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ... options,
      event: 'commandDenied'
    });
    
  }

  
  public run(error: UserError, { message }: CommandDeniedPayload) {
    return message.reply(error.message);
  }
}