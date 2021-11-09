// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/messages/create_message.ts


import { Embed } from "../embeds/embed.ts";
import { AllowedMentions } from "../messages/allowed_mentions.ts";
import { MessageReference } from "../messages/message_reference.ts";
import { FileContent } from "../discordeno/file_content.ts";
import { SnakeCasedPropertiesDeep } from "../util.ts";
import { MessageComponents } from "./components/message_components.ts";

export interface CreateMessage {
  /** The message contents (up to 2000 characters) */
  content?: string;
  /** true if this is a TTS message */
  tts?: boolean;
  /** Embedded `rich` content */
  embed?: Embed;
  /** Allowed mentions for the message */
  allowedMentions?: AllowedMentions;
  /** Include to make your message a reply */
  messageReference?: MessageReference;
  /** The contents of the file being sent */
  file?: FileContent | FileContent[];
  /** The components you would like to have sent in this message */
  components?: MessageComponents;
}

/** https://discord.com/developers/docs/resources/channel#create-message */
export type DiscordCreateMessage = SnakeCasedPropertiesDeep<Omit<CreateMessage, "file">>;
