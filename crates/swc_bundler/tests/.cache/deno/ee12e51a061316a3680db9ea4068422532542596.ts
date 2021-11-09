// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/messages/message_reaction_remove_all.ts


import { MessageReactionAdd } from "./message_reaction_add.ts";

/** https://discord.com/developers/docs/topics/gateway#message-reaction-remove-all */
export type MessageReactionRemoveAll = Pick<MessageReactionAdd, "channelId" | "messageId" | "guildId">;
