import { Args, Argument, ChatInputCommand, Command, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { GuildMember, Message } from 'discord.js';
import { ResourceMetadata } from '../../constructs/resource_metadata';
import { getVoiceInstance, createResourceFromYoutubeVideo } from '../../helpers/voice';

import { loggers } from 'winston';
import ytdl from 'ytdl-core';
const logger = loggers.get('global_logger');

export class PlayCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'play',
      aliases: ['p'],
      description: 'Play the given link or add it to the queue (only supports YouTube)',
      preconditions: ['in_voice_channel', 'valid_youtube_url'],
      runIn: CommandOptionsRunTypeEnum.GuildAny
    });
  }

  public override async messageRun(message: Message<boolean>, args: Args) {
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

  static youtubeUrl = Args.make<string>(async (parameter: string, { argument }: Argument.Context<string>) => {
        
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

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) => 
      builder //
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) => 
          option //
            .setName('url')
            .setDescription('URL of YouTube video to play')
            .setRequired(true)
        )
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputInteraction) {
    logger.verbose(`Received request to play YouTube video.`);

    let videoUrl = interaction.options.getString('url', true)

    // Only try to join the sender's voice channel if they are in one themselves
    let member = interaction.member as GuildMember;
    let channel = member.voice.channel;
    
    let currentInstance = getVoiceInstance(this.container.voiceInstanceDao, channel!);
    let resource = await createResourceFromYoutubeVideo(videoUrl, interaction);

    let position = currentInstance.playOrQueue(resource);

    let replyText;
    let metadata = resource.metadata as ResourceMetadata;
    if (position === 0) {
      replyText = `Now playing "${metadata.title}" by ${metadata.authorName}`;
    } else {
      replyText = `Queued "${metadata.title}" by ${metadata.authorName} at position ${position}`;
    } 
    
    interaction.reply(replyText);
  }


}