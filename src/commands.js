const commands = {};
import { unknown, fuckTyler, fadi } from './replies.js';
import { candle, playYoutube } from './voice.js';

commands['unknown'] = unknown;
commands['-ft'] = fuckTyler;
commands['-pizza'] = fadi;
commands['-candle'] = candle;
commands['-play'] = playYoutube;

export async function parseUserMessage(msg, logger, voiceInstances) {
  logger.info(`Received message from ${msg.author.tag} in ${msg.channel.type}`,
    ` channel ${msg.channel.id}`);

  if (msg.content.charAt(0) !== '-') {
    // plain text or unrecognized command, should only respond in DM
    logger.verbose('Message was plaintext - not a command');

    if (msg.channel.type === 'dm') {
      logger.verbose('Message was a DM - replying');
      commands['unknown'](msg, [], logger);
    } else {
      logger.verbose('Message was not a DM - ignoring');
    }
  } else {
    logger.verbose('Message was a command');
    let params = msg.content.split(' ');

    if (!commands.hasOwnProperty(params[0])) {
      logger.warn(`Command unknown from ${msg.author.tag}`);
      commands['unknown'](msg, [], logger);
    } else {
      await commands[params[0]](msg, params, logger, voiceInstances);
    }
  }
}




