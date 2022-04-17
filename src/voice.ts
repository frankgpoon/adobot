import ytdl from 'discord-ytdl-core';
import { DEFAULT_VOICE_ONLINE_TIME_S, CANDLE_VIDEO_PADDING_S, CANDLE_VIDEO_URL } from './const.js'
import { unknown } from './replies.js'
import { joinVoiceChannel, getVoiceConnection, 
  createAudioPlayer, createAudioResource,
   NoSubscriberBehavior, StreamType ,
   VoiceConnectionStatus, AudioPlayerStatus} from '@discordjs/voice';
import { Message } from 'discord.js';
import { Logger } from 'winston';

// class VoiceInstance {
//   constructor(voiceChannel, logger) {
//     this.voiceChannel = voiceChannel;
//     this.logger = logger;

//     this.resourceQueue = [];
    
//     // 1 unique connection and timer per voice instance
//     this.connection = null;
//     this.player = ;
//   }

//   joinChannel() {
//     this.connection = joinVoiceChannel({
//       channelId: this.channel.id,
//       guildId: this.channel.guild.id,
//       adapterCreator: this.channel.guild.voiceAdapterCreator,
//     });

//     this.connection.on('error', error => {

//     })
//   }

//   // supersedes with another audio player
  

//   play(audioResource) {
//     t
//   }

//   queue(audioResource) {

//   }

//   pause() {

//   }

//   unpause() {

//   }


// }

export async function playYoutube(msg: Message, params: Array<string>, logger: Logger) {
  let videoUrl = params[1];
  // TODO check if url is valid
  
  logger.verbose(`Received request to play YouTube video.`);

  if (!msg.guild) {
    logger.verbose('Command was not called in a server');
    unknown(msg, params, logger);
  }

  // Only try to join the sender's voice channel if they are in one themselves
  logger.info(`Attempting to join voice channel of ${msg.author.tag}`);
  if (msg.member!.voice.channel) {
    let channel = msg.member!.voice.channel;

    logger.verbose(`Starting connection to voice channel`);
    logger.verbose(`Playing video ${videoUrl}`);

    let connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      debug: true
    });


    let player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
      debug: true
    });

    
    let videoInfo = await ytdl.getBasicInfo(videoUrl);
    let onlineTimeMs = (parseInt(videoInfo.videoDetails.lengthSeconds) + DEFAULT_VOICE_ONLINE_TIME_S) * 1000;

    let metadata = {
      title: videoInfo.videoDetails.title,
      author: videoInfo.videoDetails.author.name
    }

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

    player.play(resource);
    
    let subscription = connection.subscribe(player);
    if (subscription) {
      setTimeout(() => subscription!.unsubscribe(), onlineTimeMs);
    }
    
    
    msg.reply(`Now playing "${metadata.title}" by ${metadata.author}`);

  } else {
    logger.warn(`${msg.author.tag} was not in a voice channel when ` + 
      `-play was called`);
  
    msg.reply(`Please join a voice channel before doing this you stupid adobo`);
  }
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
