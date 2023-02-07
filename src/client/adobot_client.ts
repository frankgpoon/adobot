import { container, SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import { VoiceInstanceDao } from '../dao/voice_instance/base_dao';
import { VoiceInstanceInMemoryDao } from '../dao/voice_instance/in_memory_dao';


export class AdobotClient extends SapphireClient {

  public constructor() {
    super({
      caseInsensitiveCommands: true,
      caseInsensitivePrefixes: true,
      defaultPrefix: '~',
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
      ],
      loadDefaultErrorListeners: false,
      loadMessageCommandListeners: true
    });
  }

  
  public override async login(token?: string) {
    container.voiceInstanceDao =  new VoiceInstanceInMemoryDao();
    return super.login(token);
  }


  public override async destroy() {
    return super.destroy();
  }
}

declare module '@sapphire/pieces' {
  interface Container {
    voiceInstanceDao: VoiceInstanceDao;
  }
}

