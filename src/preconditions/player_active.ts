import { Precondition, container } from '@sapphire/framework';
import { CommandInteraction, GuildMember, Message } from 'discord.js';
import { hasVoiceInstance } from '../helpers/voice';
import { loggers } from 'winston';

const logger = loggers.get('global_logger');

export class PlayerActivePrecondition extends Precondition {
  public override messageRun(message: Message) {
    let channel = message.member!.voice.channel;

    if (!hasVoiceInstance(container.voiceInstanceDao, channel!)) {
      logger.warn(`Player was not active when a voice command was called`);
    
      return this.error({ message: `Adobot isn't in a voice channel right now.` });
    }
  
    return this.ok();
  }

  public override chatInputRun(interaction: CommandInteraction) {

    if (!(interaction.member instanceof GuildMember)) {
      logger.warn(`Interaction with ${interaction.user.tag} had a type of ${typeof interaction.member}`);
    
      return this.error({ message: `Unknown error occurred — please feed me more adobo` });
    }

    let channel = interaction.member.voice.channel;

  
    if (!hasVoiceInstance(container.voiceInstanceDao, channel!)) {
      logger.warn(`Player was not active when a voice command was called`);
    
      return this.error({ message: `Adobot isn't in a voice channel right now.` });
    }
  
    return this.ok();
  }
}

declare module '@sapphire/framework' {
	interface Preconditions {
		player_active: never;
	}
}