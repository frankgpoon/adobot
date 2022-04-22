import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { loggers } from 'winston';

const logger = loggers.get('global_logger');

export class InVoiceChannelPrecondition extends Precondition {
  public run(message: Message) {
  
    if (!message.member!.voice.channel) {
      logger.warn(`${message.author.tag} was not in a voice channel when ` + 
        `the command was called`);
    
      return this.error({ message: `Please join a voice channel before doing this you stupid adobo` });
    }
  
    return this.ok();
  }
}

declare module '@sapphire/framework' {
	interface Preconditions {
		in_voice_channel: never;
	}
}