import ytdl from 'ytdl-core';
import { DEFAULT_VOICE_ONLINE_TIME_S, CANDLE_VIDEO_PADDING_S, CANDLE_VIDEO_URL } from './const.js'
import { unknown } from './replies.js'

class VoiceInfo {
  constructor(channel, logger) {
    this.channel = channel;
    this.logger = logger;
    // 1 unique connection and timer per channel
    this.connection = null;
    this.timer = null;
  }

  async joinChannel(timeInMs) {
    this.connection = await this.channel.join();
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.logger.info(`Setting timer to leave channel in ${timeInMs} ms`);
    this.timer = setTimeout(() => this.channel.leave(), timeInMs);
  }
}

export async function playYoutube(msg, params, logger, voiceInstances) {
  let videoUrl = params[1];
  // TODO check if url is valid
  
  logger.verbose(`Received request to play YouTube video.`);

  if (!msg.guild) {
    logger.verbose('Command was not called in a server');
    unknown(msg, params, logger);
  }

  // Only try to join the sender's voice channel if they are in one themselves
  logger.info(`Attempting to join voice channel of ${msg.author.tag}`);
  if (msg.member.voice.channel) {
    voiceInstances[msg.member.voice.guild.id] = new VoiceInfo(msg.member.voice.channel, logger);
    logger.verbose(`Starting connection to voice channel`);
    logger.verbose(`Playing video`);

    let info = await ytdl.getBasicInfo(videoUrl);
    let onlineTimeMs = (parseInt(info.videoDetails.lengthSeconds) + DEFAULT_VOICE_ONLINE_TIME_S) * 1000;

    await voiceInstances[msg.member.voice.guild.id].joinChannel(onlineTimeMs);
    voiceInstances[msg.member.voice.guild.id].connection.play(ytdl(
      videoUrl,
      { filter: 'audioonly' })).setVolume(0.25);
  } else {
    logger.warn(`${msg.author.tag} was not in a voice channel when ` + 
      `-play was called`);
  
    msg.reply(`Please join a voice channel before doing this you stupid adobo`);
  }
}

export async function candle(msg, params, logger, voiceInstances) {
  logger.verbose(`Received request to play candle video.`);

  if (!msg.guild) {
    logger.verbose('Command was not called in a server');
    unknown(msg, params, logger);
  }

  // Only try to join the sender's voice channel if they are in one themselves
  logger.info(`Attempting to join voice channel of ${msg.author.tag}`);
  if (msg.member.voice.channel) {
    voiceInstances[msg.member.voice.guild.id] = new VoiceInfo(msg.member.voice.channel, logger);
    logger.verbose(`Starting connection to voice channel`);
    logger.verbose(`Playing candle video`);

    let info = await ytdl.getBasicInfo(CANDLE_VIDEO_URL);
    let onlineTimeMs = (parseInt(info.length_seconds) + CANDLE_VIDEO_PADDING_S) * 1000;

    await voiceInstances[msg.member.voice.guild.id].joinChannel(onlineTimeMs);
    voiceInstances[msg.member.voice.guild.id].connection.play(ytdl(
      CANDLE_VIDEO_URL,
      { filter: 'audioonly' })).setVolume(0.25);
  } else {
    logger.warn(`${msg.author.tag} was not in a voice channel when ` + 
      `-candle was called`);
  
    msg.reply(`please join a voice channel before doing this`);
  }
}