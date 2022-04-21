import { Listener, UserError, CommandErrorPayload } from '@sapphire/framework';
import { loggers } from 'winston';

const logger = loggers.get('global_logger');

export class CommandErrorListener extends Listener {
  constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ... options,
      event: 'commandError'
    });
    
  }

  
  public run(error: UserError, { message }: CommandErrorPayload) {
    return message.reply(error.message);
  }
}