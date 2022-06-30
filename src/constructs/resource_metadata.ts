import { TextChannel, DMChannel, NewsChannel, ThreadChannel, PartialDMChannel, VoiceChannel } from "discord.js";

export interface ResourceMetadata {
  title: string;
  authorName: string;
  url: string;
  commandChannel:  TextChannel | DMChannel | NewsChannel | ThreadChannel | PartialDMChannel | VoiceChannel;
}
