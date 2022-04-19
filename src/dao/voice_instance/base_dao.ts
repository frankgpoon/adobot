import { VoiceInstance } from "../../constructs/voice_instance";

export interface VoiceInstanceDao {
  /**
   * Returns a VoiceInstance if there is one mapping to guildId or null otherwise
   * @param guildId guild id to get
   */
  get(guildId: string): VoiceInstance | null;

  /**
   * Puts a new VoiceInstance, or updates it if it already exists
   * @param guildId guild id to put
   * @param voiceInstance voice instance to put
   * @return true if the voiceinstance was successfully put
   */
  put(guildId: string, voiceInstance: VoiceInstance): boolean;

  /**
   * Returns true if there is a VoiceInstance mapping to guildId, false otherwise
   * @param guildId guild id to get
   */
  contains(guildId: string): boolean;
}