const commands = {};
import { unknown, fuckTyler, fadi } from './replies.js';
import { candle } from './voice.js';

commands['unknown'] = unknown;
commands['-ft'] = fuckTyler;
commands['-fadi'] = fadi;
commands['-candle'] = candle;

export async function parseUserMessage(msg, logger) {
  logger.info(`Received message from ${msg.author.tag} in ${msg.channel.type}`,
    ` channel ${msg.channel.id}`);

  if (msg.content.charAt(0) !== '-') {
    // plain text or unrecognized command, should only respond in DM
    logger.info('  Message was plaintext - not a command');

    if (msg.channel.type === 'dm') {
      logger.info('  Message was a DM - replying');
      commands['unknown'](msg, [], logger);
    } else {
      logger.info('  Message was not a DM - ignoring');
    }
  } else {
    logger.info('  Message was a command');
    let params = msg.content.split(' ');

    if (!commands.hasOwnProperty(params[0])) {
      logger.info('  Command unknown');
      commands['unknown'](msg, [], logger);
    } else {
      await commands[params[0]](msg, params, logger);
    }
  }
}




