import ytdl from 'discord-ytdl-core';
import { unknown } from '../replies.js'
import {  
  createAudioResource,
  StreamType ,
  AudioResource} from '@discordjs/voice';
import { Message, VoiceBasedChannel } from 'discord.js';
import { loggers } from 'winston';
import { VoiceInstance } from '../constructs/voice_instance';
import { ResourceMetadata } from '../constructs/resource_metadata.js';
import { VoiceInstanceDao } from '../dao/voice_instance/base_dao.js';


const logger = loggers.get('global_logger');



export function getVoiceInstance(voiceInstanceDao: VoiceInstanceDao, channel: VoiceBasedChannel): VoiceInstance {
  
  logger.info(`Attempting to join voice channel ${channel.id}`);

  let currentInstance;
  if (voiceInstanceDao.contains(channel.guild.id)) {
    logger.verbose(`Adobot is already in a channel in this guild.`);
    currentInstance = voiceInstanceDao.get(channel.guild.id);
    if (channel.id !== currentInstance!.voiceChannel?.id) {
      // adobot is playing in another channel in this guild, join this one
      logger.verbose(`Switching channels from ${currentInstance!.voiceChannel?.id} to ${channel.id}.`);
      currentInstance!.joinChannel(channel);
    }
    // adobot is in the same channel, do nothing
  } else {
    // adobot has not joined a channel in this guild
    currentInstance = new VoiceInstance();
    voiceInstanceDao.put(channel.guild.id, currentInstance);
    currentInstance.joinChannel(channel);
  }
  return currentInstance!;
}


export async function createResourceFromYoutubeVideo(videoUrl: string, msg: Message): Promise<AudioResource> {
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
export function validateVoiceCommand(msg: Message, params: Array<string>): boolean {
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


export function isValidUrl(urlStr: string): boolean {
  let url;
  try {
    url = new URL(urlStr);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
