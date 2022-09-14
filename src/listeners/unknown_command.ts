import { Listener, UnknownMessageCommandPayload } from '@sapphire/framework';
import { loggers } from 'winston';

const logger = loggers.get('global_logger');

export class UnknownCommandListener extends Listener {
  constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ... options,
      event: 'unknownCommand'
    });
    
  }

  
  public run({ message }: UnknownMessageCommandPayload) {
    logger.info(`Sent response after receiving an unknown message`);
    logger.verbose(`Response was to ${message.author.tag} in ${message.channel.type} ` +
      `channel ${message.channel.id}`);
    
    return message.reply(`OK ${message.author} I do not even know what you are saying (type ~help for help)`);
  }
}