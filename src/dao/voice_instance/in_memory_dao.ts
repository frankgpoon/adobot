import { VoiceInstance } from "../../constructs/voice_instance";
import { VoiceInstanceDao } from "./base_dao";

export class VoiceInstanceInMemoryDao implements VoiceInstanceDao {
  voiceInstanceMap: Record<string, VoiceInstance>

  constructor() {
    this.voiceInstanceMap = {};
  }

  get(guildId: string): VoiceInstance | null {
    if (this.contains(guildId)) {
      return this.voiceInstanceMap[guildId];
    } else {
      return null;
    }
  }
  put(guildId: string, voiceInstance: VoiceInstance): boolean {
    this.voiceInstanceMap[guildId] = voiceInstance;
    return true;
  }

  contains(guildId: string): boolean {
    return typeof this.voiceInstanceMap[guildId] !== 'undefined';
  }
  
}