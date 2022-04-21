import { Command, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { Message } from 'discord.js';
import { CANDLE_VIDEO_URL, HELLO_X_RYAN_CHANCE_PERCENT, HELLO_X_RYAN_URL, HELP_TEXT } from '../../const';

import { loggers } from 'winston';
import { validateVoiceCommand, getVoiceInstance, createResourceFromYoutubeVideo } from '../../helpers/voice';
const logger = loggers.get('global_logger');

export class CandleCommand extends Command {
  constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'candle',
      description: 'AAAAAAAAAAAAAAAA'
    });
  }


  async messageRun(message: Message<boolean>) {
    logger.verbose(`Received request to play candle video.`);

    let validCommand = validateVoiceCommand(message, []);
    if (!validCommand) {
      return;
    }

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
}