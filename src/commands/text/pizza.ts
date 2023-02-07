import { ChatInputCommand, Command } from '@sapphire/framework';
import { Message } from 'discord.js';
import { FADI_PASTA } from '../../const';

import { loggers } from 'winston';
const logger = loggers.get('global_logger');

export class PizzaCommand extends Command {
  
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'pizza',
      description: 'The infamous Fadi copypasta'
    });
  }

  public override messageRun(message: Message<boolean>) {
    logger.info('Sent Fadi Copypasta');
    logger.verbose(`Response was to ${message.author.tag} in channel ${message.channel.id}`);

    message.channel.send(FADI_PASTA);
  }

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) => {
      builder.setName(this.name).setDescription(this.description)
    });
  }

  public override chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    logger.info('Sent Fadi Copypasta');
    logger.verbose(`Response was to ${interaction.user.tag} in channel ${interaction.channelId}`);

    interaction.reply(FADI_PASTA);
  }
}