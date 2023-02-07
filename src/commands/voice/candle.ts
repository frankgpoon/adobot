import { ChatInputCommand, Command, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { GuildMember, Message } from 'discord.js';
import { CANDLE_VIDEO_URL, HELLO_X_RYAN_CHANCE_PERCENT, HELLO_X_RYAN_URL, HELP_TEXT } from '../../const';

import { loggers } from 'winston';
import { getVoiceInstance, createResourceFromYoutubeVideo } from '../../helpers/voice';
const logger = loggers.get('global_logger');

export class CandleCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'candle',
      description: 'AAAAAAAAAAAAAAAA',
      preconditions: ['in_voice_channel'],
      runIn: CommandOptionsRunTypeEnum.GuildAny
    });
  }

  public override async messageRun(message: Message<boolean>) {
    logger.verbose(`Received request to play candle video.`);

    // Only try to join the sender's voice channel if they are in one themselves
    let channel = message.member!.voice.channel;

    let currentInstance = getVoiceInstance(this.container.voiceInstanceDao, channel!);

    let roll =  Math.floor(Math.random() * 100);
    let tylerMessedUp = roll < HELLO_X_RYAN_CHANCE_PERCENT;
    logger.verbose(`Roll for playing HelloXRyan video was ${roll}/100`);
    
    if (tylerMessedUp) {
      let resource = await createResourceFromYoutubeVideo(HELLO_X_RYAN_URL, message);
      currentInstance.interrupt(resource, 5_000);
      message.reply(`Uh oh! Looks like Tyler messed up typing the video link again!`);
    } else {
      let resource = await createResourceFromYoutubeVideo(CANDLE_VIDEO_URL, message);
      currentInstance.interrupt(resource);
      message.react('🕯');
    }
  }

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) => {
      builder.setName(this.name).setDescription(this.description)
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    logger.verbose(`Received request to play candle video.`);

    // Only try to join the sender's voice channel if they are in one themselves
    let member = interaction.member as GuildMember;
    let channel = member.voice.channel;

    let currentInstance = getVoiceInstance(this.container.voiceInstanceDao, channel!);

    let roll =  Math.floor(Math.random() * 100);
    let tylerMessedUp = roll < HELLO_X_RYAN_CHANCE_PERCENT;
    logger.verbose(`Roll for playing HelloXRyan video was ${roll}/100`);
    
    if (tylerMessedUp) {
      let resource = await createResourceFromYoutubeVideo(HELLO_X_RYAN_URL, interaction);
      currentInstance.interrupt(resource, 5_000);
      interaction.reply(`Uh oh! Looks like Tyler messed up typing the video link again!`);
    } else {
      let resource = await createResourceFromYoutubeVideo(CANDLE_VIDEO_URL, interaction);
      currentInstance.interrupt(resource);
      interaction.reply('🕯');
    }
  }
}