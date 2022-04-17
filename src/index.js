import { Client, Intents } from 'discord.js';
import winston from 'winston';
import { format } from 'logform';

import { parseUserMessage } from './commands.js';

const DISCORD_TOKEN = process.env.ADOBOT_DISCORD_TOKEN;
const DEBUG_LEVEL = process.env.ADOBOT_DEBUG_LEVEL;

// create client
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS
    ,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
});
const logger = winston.createLogger({
  level: DEBUG_LEVEL,
  transports: [new winston.transports.Console()],
  format: format.cli()
});

const voiceInstances = {};

logger.info('Starting up Adobot');

// logging stuff when adobot signs in
client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag}!`);
  logger.verbose(`Setting up status`);
  client.user.setActivity('adobo vids - yum!', { type: 'WATCHING' })
});

// parse messages
client.on('messageCreate', async (msg) => {
  if (msg.author.id !== client.user.id) {
    // ignores messages sent by Adobot
    await parseUserMessage(msg, logger, voiceInstances);
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
