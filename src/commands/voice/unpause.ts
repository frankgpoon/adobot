import { ChatInputCommand, Command, CommandOptionsRunTypeEnum, container } from '@sapphire/framework';
import { GuildMember, Message } from 'discord.js';
import { getVoiceInstance } from '../../helpers/voice';

import { loggers } from 'winston';
const logger = loggers.get('global_logger');

export class PauseCommand extends Command {
  constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'unpause',
      description: 'Unpauses the player',
      preconditions: ['in_voice_channel', ['player_active']],
      runIn: CommandOptionsRunTypeEnum.GuildAny
    });
  }


  public override async messageRun(message: Message<boolean>) {
    logger.verbose(`Received request to unpause the current player.`);
    
    let channel = message.member!.voice.channel;
    logger.info(`Attempting to join voice channel ${channel!.id}`);

    let currentInstance = getVoiceInstance(container.voiceInstanceDao, channel!);
    
    currentInstance.unpause();
    
    message.react('👍');
  }


  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) => {
      builder.setName(this.name).setDescription(this.description)
    });
  }


  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    logger.verbose(`Received request to unpause the current player.`);
    
    // Only try to join the sender's voice channel if they are in one themselves
    let member = interaction.member as GuildMember;
    let channel = member.voice.channel;
    logger.info(`Attempting to join voice channel ${channel!.id}`);

    let currentInstance = getVoiceInstance(this.container.voiceInstanceDao, channel!);
    if (currentInstance.unpause()) {
      interaction.reply('👍');
    } else {
      interaction.reply('Nothing is paused right now.')
    }
  }
}