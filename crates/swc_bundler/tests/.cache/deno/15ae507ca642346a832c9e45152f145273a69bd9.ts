// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/interactions/commands/application_command_callback_data.ts


import { Embed } from "../../embeds/embed.ts";
import { AllowedMentions } from "../../messages/allowed_mentions.ts";
import { MessageComponents } from "../../messages/components/message_components.ts";

/** https://discord.com/developers/docs/interactions/slash-commands#interaction-response-interactionapplicationcommandcallbackdata */
export interface InteractionApplicationCommandCallbackData {
  /** Is the response TTS */
  tts?: boolean;
  /** Message content */
  content?: string;
  /** Supports up to 10 embeds */
  embeds?: Embed[];
  /** Allowed Mentions object */
  allowedMentions?: AllowedMentions;
  /** Set to `64` to make your response ephemeral */
  flags?: number;
  /** The components you would like to have sent in this message */
  components?: MessageComponents;
}
