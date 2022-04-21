import { Command, CommandOptionsRunTypeEnum, container } from '@sapphire/framework';
import { Message } from 'discord.js';
import { getVoiceInstance } from '../../helpers/voice';

import { loggers } from 'winston';
const logger = loggers.get('global_logger');

export class NextCommand extends Command {
  constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'next',
      aliases: ['n', 'skip'],
      description: 'Skips to the next song',
      preconditions: ['in_voice_channel'],
      runIn: CommandOptionsRunTypeEnum.GuildAny
    });
  }

  messageRun(message: Message<boolean>) {
    logger.verbose(`Received request to skip to next song.`);
    
    let channel = message.member!.voice.channel;
    logger.info(`Attempting to join voice channel ${channel!.id}`);

    let currentInstance = getVoiceInstance(container.voiceInstanceDao, channel!);
    
    let playingNewResource = currentInstance.playNext();

    if (playingNewResource) {
      message.react('👍');
    } else {
      message.reply(`There is nothing in the queue right now.`);
    }
  }
}