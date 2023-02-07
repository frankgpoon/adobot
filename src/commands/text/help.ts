import { ChatInputCommand, Command } from '@sapphire/framework';
import { Message } from 'discord.js';
import { HELP_TEXT } from '../../const';

import { loggers } from 'winston';
const logger = loggers.get('global_logger');

export class HelpCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'help',
      aliases: ['?'],
      description: 'Displays a help message'
    });
  }

  public override messageRun(message: Message<boolean>) {
    logger.info('Sent help');
    logger.verbose(`Response was to ${message.author.tag} in channel ${message.channel.id}`);

    message.channel.send(HELP_TEXT);
  }

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) => {
      builder.setName(this.name).setDescription(this.description)
    });
  }

  public override chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    logger.info('Sent help');
    logger.verbose(`Response was to ${interaction.user.tag} in channel ${interaction.channelId}`);

    interaction.reply(HELP_TEXT);
  }
}