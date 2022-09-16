import { ChatInputCommand, Command, CommandOptionsRunTypeEnum, container } from '@sapphire/framework';
import { GuildMember, Message } from 'discord.js';
import { getVoiceInstance } from '../../helpers/voice';

import { loggers } from 'winston';
const logger = loggers.get('global_logger');

export class NextCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'next',
      aliases: ['n', 'skip'],
      description: 'Skips to the next song',
      preconditions: ['in_voice_channel'],
      runIn: CommandOptionsRunTypeEnum.GuildAny
    });
  }

  public override messageRun(message: Message<boolean>) {
    logger.verbose(`Received request to skip to next song.`);
    
    let channel = message.member!.voice.channel;
    logger.info(`Attempting to join voice channel ${channel!.id}`);

    let currentInstance = getVoiceInstance(container.voiceInstanceDao, channel!);
    
    let playingNewResource = currentInstance.skip();

    if (playingNewResource) {
      message.react('👍');
    } else {
      message.reply(`There is nothing in the queue right now.`);
    }
  }

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) => {
      builder.setName(this.name).setDescription(this.description)
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputInteraction) {
    logger.verbose(`Received request to skip to next song.`);
    
    let member = interaction.member as GuildMember;
    let channel = member.voice.channel;
    logger.info(`Attempting to join voice channel ${channel!.id}`);

    let currentInstance = getVoiceInstance(container.voiceInstanceDao, channel!);
    
    let nextResourceMetadata = currentInstance.skip();

    if (nextResourceMetadata) {
      interaction.reply(`Now playing "${nextResourceMetadata.title}" by ${nextResourceMetadata.authorName}`);
    } else {
      interaction.reply(`There is nothing in the queue right now.`);
    }
  }
}