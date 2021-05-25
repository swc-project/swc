// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/messages/edit_message.ts


import { FileContent } from "../discordeno/file_content.ts";
import { Embed } from "../embeds/embed.ts";
import { AllowedMentions } from "./allowed_mentions.ts";
import { Attachment } from "./attachment.ts";
import { MessageComponents } from "./components/message_components.ts";

/** https://discord.com/developers/docs/resources/channel#edit-message-json-params */
export interface EditMessage {
  /** The new message contents (up to 2000 characters) */
  content?: string | null;
  /** Embedded `rich` content */
  embed?: Embed | null;
  /** Edit the flags of the message (only `SUPRESS_EMBEDS` can currently be set/unset) */
  flags?: 4 | null;
  /** The contents of the file being sent/edited */
  file?: FileContent | FileContent[] | null;
  /** Allowed mentions for the message */
  allowedMentions?: AllowedMentions | null;
  /** Attached files to keep */
  attachments?: Attachment | null;
  /** The components you would like to have sent in this message */
  components?: MessageComponents;
}
