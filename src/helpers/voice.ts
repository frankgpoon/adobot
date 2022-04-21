import ytdl from 'discord-ytdl-core';
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
