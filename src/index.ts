import { AdobotClient } from './client/adobot_client.js'

import { loggers, transports } from 'winston';
import { format } from 'logform';
import { ActivityType } from 'discord.js';
import { AdobotEnv, getLoggingLevel } from './const.js';


const DISCORD_TOKEN: string = process.env.ADOBOT_DISCORD_TOKEN !== undefined ? process.env.ADOBOT_DISCORD_TOKEN : '';
const ENV: string = process.env.ADOBOT_ENV !== undefined ? process.env.ADOBOT_ENV : AdobotEnv.DEVELOPMENT;


const logger = loggers.add('global_logger');
logger.add(new transports.Console());
logger.format = format.cli();
logger.level = getLoggingLevel(ENV);


// create client
const client = new AdobotClient();
logger.info('Starting up Adobot');


// logging stuff when adobot signs in
client.on('ready', () => {
  logger.info(`Logged in as ${client.user!.tag}!`);
  logger.verbose(`Setting up status`);

  client.user!.setActivity('adobo vids - yum!', { type: ActivityType.Watching })
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
