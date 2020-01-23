import Discord from 'Discord.js';
import winston from 'winston';
import { parseUserMessage } from './commands.js';

process.env.DEBUG_LEVEL = 'info';

import {token} from './token.js'
process.env.TOKEN = token;

const TOKEN = process.env.TOKEN;
const DEBUG_LEVEL = process.env.DEBUG_LEVEL;

// create client
const client = new Discord.Client();
const logger = winston.createLogger({
  level: DEBUG_LEVEL,
  transports: [new winston.transports.Console()]
});

logger.info('Starting up Adobot');

// logging stuff when adobot signs in
client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag}!`);
  logger.info(`Setting up status`);
  client.user.setActivity('Tyler feed', { type: 'WATCHING' })
});

// parse messages
client.on('message', async msg => {
  if (msg.author.id !== client.user.id) {
    // ignores messages sent by Adobot
    await parseUserMessage(msg, logger);
  }

});

client.on('error', (err) => {
  logger.error(err);
  client.destroy();
  process.exit();
})

// login with given token
client.login(TOKEN);



process.on('SIGINT', () => {
  logger.info('Adobot is shutting down');

  client.destroy();
  process.exit();
});