const commands = {};
import { unknown, fuckTyler, pizza, help, voteForFadi } from './replies.js';
import { candle, playYoutube } from './voice.js';

commands[''] = unknown;
commands['help'] = help;
commands['ft'] = fuckTyler;
commands['pizza'] = pizza;
commands['fadi'] = voteForFadi;
commands['candle'] = candle;
commands['play'] = playYoutube;

export async function parseUserMessage(msg, logger, voiceInstances) {
  logger.info(`Received message from ${msg.author.tag} in ${msg.channel.type}`,
    ` channel ${msg.channel.id}`);

  if (msg.content.charAt(0) !== '~') {
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
    let commandName = params[0].substr(1);

    if (!commands.hasOwnProperty(commandName)) {
      logger.warn(`Command unknown from ${msg.author.tag}`);
      commands[''](msg, [], logger);
    } else {
      await commands[commandName](msg, params, logger, voiceInstances);
    }
  }
}




