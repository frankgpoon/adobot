import { Args, Argument, Command, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { Message } from 'discord.js';
import { ResourceMetadata } from '../../constructs/resource_metadata';
import { getVoiceInstance, createResourceFromYoutubeVideo } from '../../helpers/voice';

import { loggers } from 'winston';
import ytdl from 'ytdl-core';
const logger = loggers.get('global_logger');

export class PlayCommand extends Command {
  constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'play',
      aliases: ['p'],
      description: 'Play the given link or add it to the queue (only supports YouTube)',
      preconditions: ['in_voice_channel'],
      runIn: CommandOptionsRunTypeEnum.GuildAny
    });
  }

  async messageRun(message: Message<boolean>, args: Args) {
    logger.verbose(`Received request to play YouTube video.`);

    let videoUrl = await args.pick(PlayCommand.youtubeUrl);

    // Only try to join the sender's voice channel if they are in one themselves
    let channel = message.member!.voice.channel;
    
    let currentInstance = getVoiceInstance(this.container.voiceInstanceDao, channel!);
    let resource = await createResourceFromYoutubeVideo(videoUrl, message);

    let position = currentInstance.playOrQueue(resource);

    let replyText;
    let metadata = resource.metadata as ResourceMetadata;
    if (position === 0) {
      replyText = `Now playing "${metadata.title}" by ${metadata.authorName}`;
    } else {
      replyText = `Queued "${metadata.title}" by ${metadata.authorName} at position ${position}`;
    } 
    
    message.reply(replyText);
  }

  static youtubeUrl = Args.make<string>((parameter: string, { argument }: Argument.Context<string>) => {
        
    if (ytdl.validateURL(parameter)) {
      let id = ytdl.getURLVideoID(parameter);
      if (ytdl.validateID(id)) {
        return Args.ok(parameter);
      }
    }

    logger.verbose(`${parameter} is an invalid YT url`);

    return Args.error({
      argument,
      parameter,
      message: `Your Youtube URL was not valid. Please have a valid link so the bot doesn't crash.`
    });
  });
}