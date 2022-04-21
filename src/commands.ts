const commands: Record<string, Function> = {};

import { Message } from 'discord.js';
import { loggers } from 'winston';
import { unknown } from './replies.js';
import { candle, play, next } from './voice.js';
import { VoiceInstanceDao } from './dao/voice_instance/base_dao.js';


const logger = loggers.get('global_logger');


commands[''] = unknown;

commands['candle'] = candle;

commands['play'] = play;
commands['p'] = play;

commands['next'] = next;
commands['n'] = next;
commands['skip'] = next;


export async function parseUserMessage(msg: Message, voiceInstanceDao: VoiceInstanceDao) {
  logger.info(`Received message from ${msg.author.tag} in ${msg.channel.type}`,
    ` channel ${msg.channel.id}`);

  if (msg.content.charAt(0) !== '~') {
    // plain text or unrecognized command, should only respond in DM
    logger.verbose('Message was plaintext - not a command');

    if (msg.channel.type === 'DM') {
      logger.verbose('Message was a DM - replying');
      commands['unknown'](msg, []);
    } else {
      logger.verbose('Message was not a DM - ignoring');
    }
  } else {
    logger.verbose('Message was a command');
    let params = msg.content.split(' ');
    let commandName = params[0].substring(1);

    if (!commands.hasOwnProperty(commandName)) {
      logger.warn(`Command unknown from ${msg.author.tag}`);
      commands[''](msg, []);
    } else {
  
      await commands[commandName](msg, params, voiceInstanceDao);
    }
  }
}




