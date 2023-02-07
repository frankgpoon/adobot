import { ChatInputCommand, Command } from '@sapphire/framework';
import { Message } from 'discord.js';

import { loggers } from 'winston';
const logger = loggers.get('global_logger');

export class FuckTylerCommand extends Command {
  
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'ft',
      description: 'Fuck tyler',
    });
  }

  public override messageRun(message: Message<boolean>) {
    logger.info(`Sent a message saying fuck Tyler`);
    logger.verbose(`Response was to ${message.author.tag} in channel ${message.channel.id}`);

    message.channel.send('Yo fuck Tyler');
  }

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) => {
      builder.setName(this.name).setDescription(this.description)
    });
  }

  public override chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    logger.info(`Sent a message saying fuck Tyler`);
    logger.verbose(`Response was to ${interaction.user.tag} in channel ${interaction.channelId}`);

    interaction.reply('Yo fuck Tyler');
  }


}