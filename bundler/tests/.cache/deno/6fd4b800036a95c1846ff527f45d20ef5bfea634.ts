// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/messages/reaction.ts


import { Emoji } from "../emojis/emoji.ts";

/** https://discord.com/developers/docs/resources/channel#reaction-object */
export interface Reaction {
  /** Times this emoji has been used to react */
  count: number;
  /** Whether the current user reacted using this emoji */
  me: boolean;
  /** Emoji information */
  emoji: Partial<Emoji>;
}
