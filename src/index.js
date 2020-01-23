import Discord from 'Discord.js';
import winston from 'winston';
import { parseUserMessage } from './commands.js';

process.env.DEBUG_LEVEL = 'info';

const TOKEN = process.env.TOKEN;
const DEBUG_LEVEL = process.env.DEBUG_LEVEL;

// create client
const client = new Discord.Client();
const logger = winston.createLogger({
  level: process.env.DEBUG_LEVEL,
  transports: [new winston.transports.Console()]
});

logger.info('Starting up Adobot');

// logging stuff when adobot signs in
client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag}!`);
});

// parse messages
client.on('message', async msg => {
  if (msg.author.id !== client.user.id) {
    // ignores messages sent by Adobot
    await parseUserMessage(msg, logger);
  }

});

// login with given token
client.login(TOKEN);