import { Precondition } from '@sapphire/framework';
import { CommandInteraction, GuildMember, Message } from 'discord.js';
import { loggers } from 'winston';

const logger = loggers.get('global_logger');

export class InVoiceChannelPrecondition extends Precondition {
  public override messageRun(message: Message) {
  
    if (!message.member!.voice.channel) {
      logger.warn(`${message.author.tag} was not in a voice channel when ` + 
        `the command was called`);
    
      return this.error({ message: `Please join a voice channel before doing this you stupid adobo` });
    }
  
    return this.ok();
  }

  public override chatInputRun(interaction: CommandInteraction) {

    if (!(interaction.member instanceof GuildMember)) {
      logger.warn(`Interaction with ${interaction.user.tag} had a type of ${typeof interaction.member}`);
    
      return this.error({ message: `Unknown error occurred — please feed me more adobo` });
    }

  
    if (!interaction.member!.voice.channel) {
      logger.warn(`${interaction.user.tag} was not in a voice channel when ` + 
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