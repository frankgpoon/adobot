import ytdl from 'discord-ytdl-core';
import { DEFAULT_VOICE_ONLINE_TIME_MS, CANDLE_VIDEO_PADDING_S, CANDLE_VIDEO_URL } from './const.js'
import { unknown } from './replies.js'
import { getVoiceConnection, 
  createAudioResource,
   StreamType ,
   VoiceConnectionStatus} from '@discordjs/voice';
import { Message } from 'discord.js';
import { Logger } from 'winston';
import { VoiceInstance } from './constructs/voice_instance';
import { ResourceMetadata } from './constructs/resource_metadata.js';

export async function playYoutube(msg: Message, params: Array<string>, logger: Logger, voiceInstances: Record<string, VoiceInstance>) {
  logger.verbose(`Received request to play YouTube video.`);

  if (!msg.guild) {
    logger.verbose('Command was not called in a server');
    unknown(msg, params, logger);
    return;
  }

  if (!msg.member!.voice.channel) {
    logger.warn(`${msg.author.tag} was not in a voice channel when ` + 
      `-play was called`);
  
    msg.reply(`Please join a voice channel before doing this you stupid adobo`);
    return;
  }

  let videoUrl = params[1];
  
  if (!isValidUrl(videoUrl)) {
    logger.verbose(`${videoUrl} is an invalid url`);
    msg.reply(`Your URL was not valid. Please have a valid link so the bot doesn't crash.`);
    return;
  }

  // Only try to join the sender's voice channel if they are in one themselves
  logger.info(`Attempting to join voice channel of ${msg.author.tag}`);
  
  
  logger.verbose(`Starting connection to voice channel`);
  logger.verbose(`Playing video ${videoUrl}`);

  let channel = msg.member!.voice.channel;
  let currentInstance;
  if (voiceInstances[channel.guild.id]) {
    currentInstance = voiceInstances[channel.guild.id];
    if (channel.id !== currentInstance.voiceChannel?.id) {
      // adobot is playing in another channel in this guild, join this one
      currentInstance.joinChannel(channel);
    }
    // adobot is in the same channel, do nothing
  } else {
    // adobot has not joined a channel in this guild
    currentInstance = new VoiceInstance(logger);
    voiceInstances[channel.guild.id] = currentInstance;
    currentInstance.joinChannel(channel);
  }
  
  let videoInfo = await ytdl.getBasicInfo(videoUrl);
  // let onlineTimeMs = (parseInt(videoInfo.videoDetails.lengthSeconds) + DEFAULT_VOICE_ONLINE_TIME_MS) * 1000;

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

  let position = currentInstance.playOrQueue(resource);

  let replyText;
  if (position === 0) {
    replyText = `Now playing "${metadata.title}" by ${metadata.authorName}`;
  } else {
    replyText = `Queued "${metadata.title}" by ${metadata.authorName} at position ${position}`;
  } 
  
  msg.reply(replyText);
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

export async function candle(msg: Message, params: Array<string>, logger: Logger) {
  logger.verbose(`Received request to play candle video.`);
  msg.reply(`Hey guys what's up this is HelloXRyan :)`);

  // if (!msg.guild) {
  //   logger.verbose('Command was not called in a server');
  //   unknown(msg, params, logger);
  // }

  // // Only try to join the sender's voice channel if they are in one themselves
  // logger.info(`Attempting to join voice channel of ${msg.author.tag}`);
  // if (msg.member.voice.channel) {
  //   voiceInstances[msg.member.voice.guild.id] = new VoiceInfo(msg.member.voice.channel, logger);
  //   logger.verbose(`Starting connection to voice channel`);
  //   logger.verbose(`Playing candle video`);

  //   let info = await ytdl.getBasicInfo(CANDLE_VIDEO_URL);
  //   let onlineTimeMs = (parseInt(info.videoDetails.lengthSeconds) + CANDLE_VIDEO_PADDING_S) * 1000;

  //   await voiceInstances[msg.member.voice.guild.id].joinChannel(onlineTimeMs);
  //   voiceInstances[msg.member.voice.guild.id].connection.play(ytdl(
  //     CANDLE_VIDEO_URL,
  //     { filter: 'audioonly' })).setVolume(0.25);
  // } else {
  //   logger.warn(`${msg.author.tag} was not in a voice channel when ` + 
  //     `-candle was called`);
  
  //   msg.reply(`please join a voice channel before doing this`);
  // }
}
