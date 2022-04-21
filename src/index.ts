import { SapphireClient } from '@sapphire/framework';

import { Intents, Message } from 'discord.js';
import { loggers, transports } from 'winston';
import { format } from 'logform';

import { parseUserMessage } from './commands.js';
import { VoiceInstanceDao } from './dao/voice_instance/base_dao.js';
import { VoiceInstanceInMemoryDao } from './dao/voice_instance/in_memory_dao.js';
import { AdobotClient } from './client/adobot_client.js';

const DISCORD_TOKEN: string = process.env.ADOBOT_DISCORD_TOKEN !== undefined ? process.env.ADOBOT_DISCORD_TOKEN : '';
const DEBUG_LEVEL: string = process.env.ADOBOT_DEBUG_LEVEL !== undefined ? process.env.ADOBOT_DEBUG_LEVEL : 'verbose';


const logger = loggers.add('global_logger');
logger.add(new transports.Console());
logger.format = format.cli();
logger.level = DEBUG_LEVEL;


// create client
const client = new AdobotClient();



logger.info('Starting up Adobot');
// logger2.info('Starting up Adobot');

// logging stuff when adobot signs in
client.on('ready', () => {
  logger.info(`Logged in as ${client.user!.tag}!`);
  // logger2.info(`Logged in as ${client.user!.tag}!`);
  logger.verbose(`Setting up status`);
  // logger2.verbose(`Setting up status`);

  client.user!.setActivity('adobo vids - yum!', { type: 'WATCHING' })
});

// parse messages
client.on('messageCreate', async (msg: Message) => {
  if (msg.author.id !== client.user!.id) {
    // ignores messages sent by Adobot
    await parseUserMessage(msg);
  }

});

client.on('error', (err) => {
  logger.error(err);
  client.destroy();
  process.exit();
})

// login with given token
client.login(DISCORD_TOKEN);



process.on('SIGINT', () => {
  logger.info('Adobot is shutting down');

  client.destroy();
  process.exit();
});
