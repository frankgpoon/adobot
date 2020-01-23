import ytdl from 'ytdl-core';
import { CANDLE_VIDEO } from './const.js'
import { unknown } from './replies.js'

export async function candle(msg, params, logger) {
  logger.verbose(`Received request to play candle video.`);

  if (!msg.guild) {
    logger.verbose('Command was not called in a server');
    unknown(msg, params, logger);
  }

  // Only try to join the sender's voice channel if they are in one themselves
  logger.info(`Attempting to join voice channel of ${msg.author.tag}`);
  if (msg.member.voice.channel) {
    logger.verbose(`Starting connection to voice channel`);
    const connection = await msg.member.voice.channel.join();
    logger.verbose(`Playing candle video`);

    connection.play(ytdl(
      CANDLE_VIDEO,
      { filter: 'audioonly' }));
  } else {
    logger.warn(`${msg.author.tag} was not in a voice channel when ` + 
      `-candle was called`);
  
    msg.reply(`please join a voice channel before doing this`);
  }
}