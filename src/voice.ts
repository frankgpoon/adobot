import ytdl from 'discord-ytdl-core';
import { CANDLE_VIDEO_URL, HELLO_X_RYAN_CHANCE_PERCENT, HELLO_X_RYAN_URL } from './const.js'
import { unknown } from './replies.js'
import {  
  createAudioResource,
  StreamType ,
  AudioResource} from '@discordjs/voice';
import { Message, VoiceBasedChannel } from 'discord.js';
import { loggers } from 'winston';
import { VoiceInstance } from './constructs/voice_instance';
import { ResourceMetadata } from './constructs/resource_metadata.js';


const logger = loggers.get('global_logger');


export async function play(msg: Message, params: Array<string>, voiceInstances: Record<string, VoiceInstance>) {
  logger.verbose(`Received request to play YouTube video.`);

  let validCommand = validateVoiceCommand(msg, params);
  if (!validCommand) {
    return;
  }

  let videoUrl = params[1];
  
  if (!isValidUrl(videoUrl)) {
    logger.verbose(`${videoUrl} is an invalid url`);
    msg.reply(`Your URL was not valid. Please have a valid link so the bot doesn't crash.`);
    return;
  }

  // Only try to join the sender's voice channel if they are in one themselves
  let channel = msg.member!.voice.channel;
  
  let currentInstance = getVoiceInstance(voiceInstances, channel!);
  let resource = await createResourceFromYoutubeVideo(videoUrl, msg);

  let position = currentInstance.playOrQueue(resource);

  let replyText;
  let metadata = resource.metadata as ResourceMetadata;
  if (position === 0) {
    replyText = `Now playing "${metadata.title}" by ${metadata.authorName}`;
  } else {
    replyText = `Queued "${metadata.title}" by ${metadata.authorName} at position ${position}`;
  } 
  
  msg.reply(replyText);
}


export async function next(msg: Message, params: Array<string>, voiceInstances: Record<string, VoiceInstance>) {
  logger.verbose(`Received request to skip to next song.`);

  let validCommand = validateVoiceCommand(msg, params);
  if (!validCommand) {
    return;
  }
  
  let channel = msg.member!.voice.channel;
  logger.info(`Attempting to join voice channel ${channel!.id}`);

  let currentInstance = getVoiceInstance(voiceInstances, channel!);
  
  let playingNewResource = currentInstance.playNext();

  if (playingNewResource) {
    msg.react('👍');
  } else {
    msg.reply(`There is nothing in the queue right now.`);
  }
}


export async function candle(msg: Message, params: Array<string>, voiceInstances: Record<string, VoiceInstance>) {
  logger.verbose(`Received request to play candle video.`);

  let validCommand = validateVoiceCommand(msg, params);
  if (!validCommand) {
    return;
  }

  // Only try to join the sender's voice channel if they are in one themselves
  let channel = msg.member!.voice.channel;

  let currentInstance = getVoiceInstance(voiceInstances, channel!);

  let roll =  Math.floor(Math.random() * 100);
  let tylerMessedUp = roll < HELLO_X_RYAN_CHANCE_PERCENT;
  logger.verbose(`Roll for playing HelloXRyan video was ${roll}/100`);
  
  if (tylerMessedUp) {
    let resource = await createResourceFromYoutubeVideo(HELLO_X_RYAN_URL, msg);
    currentInstance.interrupt(resource, 5_000);
    msg.reply(`Uh oh! Looks like Tyler messed up typing the video link again!`);
  } else {
    let resource = await createResourceFromYoutubeVideo(CANDLE_VIDEO_URL, msg);
    currentInstance.interrupt(resource);
    msg.react('🕯');
  }
}


function getVoiceInstance(voiceInstances: Record<string, VoiceInstance>, channel: VoiceBasedChannel): VoiceInstance {
  
  logger.info(`Attempting to join voice channel ${channel.id}`);

  let currentInstance;
  if (voiceInstances[channel.guild.id]) {
    logger.verbose(`Adobot is already in a channel in this guild.`);
    currentInstance = voiceInstances[channel.guild.id];
    if (channel.id !== currentInstance.voiceChannel?.id) {
      // adobot is playing in another channel in this guild, join this one
      logger.verbose(`Switching channels from ${currentInstance.voiceChannel?.id} to ${channel.id}.`);
      currentInstance.joinChannel(channel);
    }
    // adobot is in the same channel, do nothing
  } else {
    // adobot has not joined a channel in this guild
    currentInstance = new VoiceInstance();
    voiceInstances[channel.guild.id] = currentInstance;
    currentInstance.joinChannel(channel);
  }
  return currentInstance;
}


async function createResourceFromYoutubeVideo(videoUrl: string, msg: Message): Promise<AudioResource> {
  let videoInfo = await ytdl.getBasicInfo(videoUrl);

  let metadata: ResourceMetadata = {
    title: videoInfo.videoDetails.title,
    authorName: videoInfo.videoDetails.author.name,
    url: videoUrl,
    commandChannel: msg.channel
  };

  let resource = createAudioResource(
    ytdl(
      videoUrl,
      { 
        filter: 'audioonly',
        opusEncoded: true
      }
    ), {
      inlineVolume: true,
      inputType: StreamType.Opus,
      metadata: metadata
    }
  );

  resource.volume!.setVolume(0.25);
  return resource;
}

/**
 * Validates a command and replies if it is invalid
 * @param msg message
 * @param params parameters of he command
 * @param logger logger
 * @returns true if the message is valid and false otherwise
 */
function validateVoiceCommand(msg: Message, params: Array<string>): boolean {
  if (!msg.guild) {
    logger.verbose('Command was not called in a server');
    unknown(msg, params);
    return false;
  }

  if (!msg.member!.voice.channel) {
    logger.warn(`${msg.author.tag} was not in a voice channel when ` + 
      `-play was called`);
  
    msg.reply(`Please join a voice channel before doing this you stupid adobo`);
    return false;
  }

  return true;
}


function isValidUrl(urlStr: string): boolean {
  let url;
  try {
    url = new URL(urlStr);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
