import ytdl from 'ytdl-core';
import { CANDLE_VIDEO } from './const.js'
import { unknown } from './replies.js'

export async function candle(msg, params, logger) {
  if (!msg.guild) {
    logger.info('Command was not called in a server');
    unknown(msg, params, logger);
  }

  // Only try to join the sender's voice channel if they are in one themselves
  logger.info(`Received request to play candle video.`);
  logger.info(`  Attempting to join voice channel of ${msg.author.tag}`);
  if (msg.member.voice.channel) {
    logger.info(`  Starting connection to voice channel`);
    const connection = await msg.member.voice.channel.join();
    logger.info(`  Playing candle video`);
    connection.play(ytdl(
      CANDLE_VIDEO,
      { filter: 'audioonly' }));
  } else {
    logger.info(`  ${msg.author.tag} was not in a voice channel`);
    msg.reply(`please join a voice channel before doing this`);
  }
}