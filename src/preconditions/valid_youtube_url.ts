import { Precondition } from '@sapphire/framework';
import type { ChatInputCommandInteraction, CommandInteraction, Message } from 'discord.js';
import { loggers } from 'winston';
import ytdl from 'ytdl-core';

const logger = loggers.get('global_logger');

export class ValidYoutubeUrlPrecondition extends Precondition {
  public override messageRun(message: Message) {
    return this.ok();
  }

  public override chatInputRun(interaction: ChatInputCommandInteraction) {

    let url = interaction.options.getString('url', true);

    if (!url) {
      return this.error({ message: 'A URL was not provided' })
    }

    if (ytdl.validateURL(url)) {
      let id = ytdl.getURLVideoID(url);
      if (ytdl.validateID(id)) {
        return this.ok();
      }
    }

    logger.verbose(`${url} is an invalid YT url`);

    return this.error({
      message: `Your Youtube URL was not valid. Please have a valid link so Adobot doesn't crash.`
    });
  }
}

declare module '@sapphire/framework' {
	interface Preconditions {
		valid_youtube_url: never;
	}
}