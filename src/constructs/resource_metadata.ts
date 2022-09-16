import { TextChannel, DMChannel, NewsChannel, ThreadChannel, PartialDMChannel, VoiceChannel, TextBasedChannel } from "discord.js";
import { JSDocNullableType } from "typescript";

export interface ResourceMetadata {
  title: string;
  authorName: string;
  url: string;
  commandChannel:  TextBasedChannel | null;
}
