// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/webhooks/edit_webhook_message.ts


import { FileContent } from "../discordeno/file_content.ts";
import { Embed } from "../embeds/embed.ts";
import { AllowedMentions } from "../messages/allowed_mentions.ts";
import { Attachment } from "../messages/attachment.ts";
import { MessageComponents } from "../messages/components/message_components.ts";

/** https://discord.com/developers/docs/resources/webhook#edit-webhook-message-jsonform-params */
export interface EditWebhookMessage {
  /** The message contents (up to 2000 characters) */
  content?: string | null;
  /** Embedded `rich` content */
  embeds?: Embed[] | null;
  /** The contents of the file being sent/edited */
  file?: FileContent | FileContent[] | null;
  /** Allowed mentions for the message */
  allowedMentions?: AllowedMentions | null;
  /** Attached files to keep */
  attachments?: Attachment | null;
  /** The components you would like to have sent in this message */
  components?: MessageComponents;
}
