import { Client, Intents, Message } from 'discord.js';
import winston from 'winston';
import { format } from 'logform';

import { parseUserMessage } from './commands.js';
import { VoiceInstance } from "./constructs/voice_instance";

const DISCORD_TOKEN: string = process.env.ADOBOT_DISCORD_TOKEN !== undefined ? process.env.ADOBOT_DISCORD_TOKEN : '';
const DEBUG_LEVEL: string = process.env.ADOBOT_DEBUG_LEVEL !== undefined ? process.env.ADOBOT_DEBUG_LEVEL : 'verbose';

// create client
const client: Client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
});

const logger = winston.createLogger({
  level: DEBUG_LEVEL,
  transports: [new winston.transports.Console()],
  format: format.cli()
});

const voiceInstances: Record<string, VoiceInstance> = {};

logger.info('Starting up Adobot');

// logging stuff when adobot signs in
client.on('ready', () => {
  logger.info(`Logged in as ${client.user!.tag}!`);
  logger.verbose(`Setting up status`);

  client.user!.setActivity('adobo vids - yum!', { type: 'WATCHING' })
});

// parse messages
client.on('messageCreate', async (msg: Message) => {
  if (msg.author.id !== client.user!.id) {
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
