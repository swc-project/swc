// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/structures/message.ts


import { eventHandlers } from "../bot.ts";
import { cache, cacheHandlers } from "../cache.ts";
import { sendDirectMessage } from "../helpers/members/send_direct_message.ts";
import { addReaction } from "../helpers/messages/add_reaction.ts";
import { addReactions } from "../helpers/messages/add_reactions.ts";
import { deleteMessage } from "../helpers/messages/delete_message.ts";
import { editMessage } from "../helpers/messages/edit_message.ts";
import { pinMessage } from "../helpers/messages/pin_message.ts";
import { removeAllReactions } from "../helpers/messages/remove_all_reactions.ts";
import { removeReaction } from "../helpers/messages/remove_reaction.ts";
import { removeReactionEmoji } from "../helpers/messages/remove_reaction_emoji.ts";
import { sendMessage } from "../helpers/messages/send_message.ts";
import type { GuildMember } from "../types/members/guild_member.ts";
import type { CreateMessage } from "../types/messages/create_message.ts";
import type { EditMessage } from "../types/messages/edit_message.ts";
import type { Message } from "../types/messages/message.ts";
import { bigintToSnowflake, snowflakeToBigint } from "../util/bigint.ts";
import { CHANNEL_MENTION_REGEX } from "../util/constants.ts";
import { createNewProp } from "../util/utils.ts";
import { DiscordenoChannel } from "./channel.ts";
import { DiscordenoGuild } from "./guild.ts";
import { DiscordenoMember } from "./member.ts";
import { DiscordenoRole } from "./role.ts";

const MESSAGE_SNOWFLAKES = ["id", "channelId", "guildId", "webhookId", "applicationId"];

const messageToggles = {
  /** Whether this was a TTS message */
  tts: 1n,
  /** Whether this message mentions everyone */
  mentionEveryone: 2n,
  /** Whether this message is pinned */
  pinned: 4n,
};

const baseMessage: Partial<DiscordenoMessage> = {
  get channel() {
    if (this.guildId) return cache.channels.get(this.channelId!);
    return cache.channels.get(this.authorId!);
  },
  get guild() {
    if (!this.guildId) return undefined;
    return cache.guilds.get(this.guildId);
  },
  get member() {
    if (!this.authorId) return undefined;
    return cache.members.get(this.authorId);
  },
  get guildMember() {
    if (!this.guildId) return undefined;
    return this.member?.guilds.get(this.guildId);
  },
  get link() {
    return `https://discord.com/channels/${this.guildId || "@me"}/${this.channelId}/${this.id}`;
  },
  get mentionedRoles() {
    return this.mentionedRoleIds?.map((id) => this.guild?.roles.get(id)) || [];
  },
  get mentionedChannels() {
    return this.mentionedChannelIds?.map((id) => cache.channels.get(id)) || [];
  },
  get mentionedMembers() {
    return this.mentionedUserIds?.map((id) => cache.members.get(id)) || [];
  },

  // METHODS
  delete(reason, delayMilliseconds) {
    return deleteMessage(this.channelId!, this.id!, reason, delayMilliseconds);
  },
  edit(content) {
    return editMessage(this as DiscordenoMessage, content);
  },
  pin() {
    return pinMessage(this.channelId!, this.id!);
  },
  addReaction(reaction) {
    return addReaction(this.channelId!, this.id!, reaction);
  },
  addReactions(reactions, ordered) {
    return addReactions(this.channelId!, this.id!, reactions, ordered);
  },
  reply(content) {
    const contentWithMention: CreateMessage =
      typeof content === "string"
        ? {
            content,
            allowedMentions: {
              repliedUser: true,
            },
            messageReference: {
              messageId: bigintToSnowflake(this.id!),
              failIfNotExists: false,
            },
          }
        : {
            ...content,
            allowedMentions: {
              ...(content.allowedMentions || {}),
              repliedUser: true,
            },
            messageReference: {
              messageId: bigintToSnowflake(this.id!),
              failIfNotExists: content.messageReference?.failIfNotExists === true,
            },
          };

    if (this.guildId) return sendMessage(this.channelId!, contentWithMention);
    return sendDirectMessage(this.authorId!, contentWithMention);
  },
  send(content) {
    if (this.guildId) return sendMessage(this.channelId!, content);
    return sendDirectMessage(this.authorId!, content);
  },
  async alert(content, timeout = 10, reason = "") {
    if (this.guildId) {
      return await sendMessage(this.channelId!, content).then((response) => {
        response.delete(reason, timeout * 1000).catch(console.error);
      });
    }

    return await sendDirectMessage(this.authorId!, content).then((response) => {
      response.delete(reason, timeout * 1000).catch(console.error);
    });
  },
  async alertReply(content, timeout = 10, reason = "") {
    return await this.reply!(content).then((response) => response.delete(reason, timeout * 1000).catch(console.error));
  },
  removeAllReactions() {
    return removeAllReactions(this.channelId!, this.id!);
  },
  removeReactionEmoji(reaction) {
    return removeReactionEmoji(this.channelId!, this.id!, reaction);
  },
  removeReaction(reaction, userId) {
    return removeReaction(this.channelId!, this.id!, reaction, { userId });
  },
  get tts() {
    return Boolean(this.bitfield! & messageToggles.tts);
  },
  get mentionEveryone() {
    return Boolean(this.bitfield! & messageToggles.mentionEveryone);
  },
  get pinned() {
    return Boolean(this.bitfield! & messageToggles.pinned);
  },
  toJSON() {
    return {
      id: this.id?.toString(),
      channelId: this.channelId?.toString(),
      guildId: this.guildId?.toString(),
      author: {
        id: this.authorId?.toString(),
        username: this.tag?.substring(0, this.tag.length - 5),
        discriminator: this.tag?.substring(this.tag.length - 4),
        avatar: this.member?.avatar,
        bot: this.member?.bot,
        system: this.member?.system,
        mfaEnabled: this.member?.mfaEnabled,
        locale: this.member?.locale,
        verified: this.member?.verified,
        email: this.member?.email,
        flags: this.member?.flags,
        premiumType: this.member?.premiumType,
        publicFlags: this.member?.publicFlags,
      },
      member: this.member,
      content: this.content,
      timestamp: this.timestamp ? new Date(this.timestamp).toISOString() : undefined,
      editedTimestamp: this.editedTimestamp ? new Date(this.editedTimestamp).toISOString() : undefined,
      tts: this.tts,
      mentionEveryone: this.mentionEveryone,
      mentions: this.mentions,
      mentionRoles: this.mentionRoles,
      mentionChannels: this.mentionChannels,
      attachments: this.attachments,
      embeds: this.embeds,
      reactions: this.reactions,
      nonce: this.nonce,
      pinned: this.pinned,
      webhookId: this.webhookId,
      type: this.type,
      activity: this.activity,
      application: this.application,
      applicationId: this.applicationId,
      messageReference: this.messageReference,
      flags: this.flags,
      stickers: this.stickers,
      referencedMessage: this.referencedMessage,
      interaction: this.interaction,
      thread: this.thread,
      components: this.components,
    } as Message;
  },
};

export async function createDiscordenoMessage(data: Message) {
  const {
    guildId = "",
    mentionChannels = [],
    mentions = [],
    mentionRoles = [],
    editedTimestamp,
    author,
    messageReference,
    ...rest
  } = data;

  let bitfield = 0n;

  const props: Record<string, ReturnType<typeof createNewProp>> = {};
  for (const [key, value] of Object.entries(rest)) {
    eventHandlers.debug?.("loop", `Running for of loop in createDiscordenoMessage function.`);

    const toggleBits = messageToggles[key as keyof typeof messageToggles];
    if (toggleBits) {
      bitfield |= value ? toggleBits : 0n;
      continue;
    }

    // Don't add member to props since it would overwrite the message.member getter
    if (key === "member") continue;

    props[key] = createNewProp(
      MESSAGE_SNOWFLAKES.includes(key) ? (value ? snowflakeToBigint(value) : undefined) : value
    );
  }

  props.authorId = createNewProp(snowflakeToBigint(author.id));
  props.isBot = createNewProp(author.bot || false);
  props.tag = createNewProp(`${author.username}#${author.discriminator}`);

  // Discord doesnt give guild id for getMessage() so this will fill it in
  const guildIdFinal =
    snowflakeToBigint(guildId) ||
    (await cacheHandlers.get("channels", snowflakeToBigint(data.channelId)))?.guildId ||
    0n;

  const message: DiscordenoMessage = Object.create(baseMessage, {
    ...props,
    content: createNewProp(data.content || ""),
    guildId: createNewProp(guildIdFinal),
    mentionedUserIds: createNewProp(mentions.map((m) => snowflakeToBigint(m.id))),
    mentionedRoleIds: createNewProp(mentionRoles.map((id) => snowflakeToBigint(id))),
    mentionedChannelIds: createNewProp([
      // Keep any ids that discord sends
      ...mentionChannels.map((m) => snowflakeToBigint(m.id)),
      // Add any other ids that can be validated in a channel mention format
      ...(rest.content?.match(CHANNEL_MENTION_REGEX) || []).map((text) =>
        // converts the <#123> into 123
        snowflakeToBigint(text.substring(2, text.length - 1))
      ),
    ]),
    timestamp: createNewProp(Date.parse(data.timestamp)),
    editedTimestamp: createNewProp(editedTimestamp ? Date.parse(editedTimestamp) : undefined),
    messageReference: createNewProp(
      messageReference
        ? {
            messageId: messageReference.messageId ? snowflakeToBigint(messageReference.messageId) : undefined,
            channelId: messageReference.channelId ? snowflakeToBigint(messageReference.channelId) : undefined,
            guildId: messageReference.guildId ? snowflakeToBigint(messageReference.guildId) : undefined,
          }
        : undefined
    ),
    bitfield: createNewProp(bitfield),
  });

  return message;
}

export interface DiscordenoMessage
  extends Omit<
    Message,
    | "id"
    | "webhookId"
    | "timestamp"
    | "editedTimestamp"
    | "guildId"
    | "channelId"
    | "member"
    | "author"
    | "applicationId"
  > {
  id: bigint;
  /** Whether or not this message was sent by a bot */
  isBot: boolean;
  /** The username#discrimnator for the user who sent this message */
  tag: string;
  /** Holds all the boolean toggles. */
  bitfield: bigint;

  // For better user experience

  /** Id of the guild which the massage has been send in. "0n" if it a DM */
  guildId: bigint;
  /** id of the channel the message was sent in */
  channelId: bigint;
  /** If the message is generated by a webhook, this is the webhook's id */
  webhookId?: bigint;
  /** The id of the user who sent this message */
  authorId: bigint;
  /** If the message is a response to an Interaction, this is the id of the interaction's application */
  applicationId?: bigint;
  /** The message content for this message. Empty string if no content was sent like an attachment only. */
  content: string;
  /** Ids of users specifically mentioned in the message */
  mentionedUserIds: bigint[];
  /** Ids of roles specifically mentioned in this message */
  mentionedRoleIds: bigint[];
  /** Channels specifically mentioned in this message */
  mentionedChannelIds?: bigint[];
  /** When this message was sent */
  timestamp: number;
  /** When this message was edited (or undefined if never) */
  editedTimestamp?: number;

  // GETTERS

  /** The channel where this message was sent. Can be undefined if uncached. */
  channel?: DiscordenoChannel;
  /** The guild of this message. Can be undefined if not in cache or in DM */
  guild?: DiscordenoGuild;
  /** The member for the user who sent the message. Can be undefined if not in cache or in dm. */
  member?: DiscordenoMember;
  /** The guild member details for this guild and member. Can be undefined if not in cache or in dm. */
  guildMember?: Omit<GuildMember, "joinedAt" | "premiumSince" | "roles"> & {
    joinedAt?: number;
    premiumSince?: number;
    roles: bigint[];
  };
  /** The url link to this message */
  link: string;
  /** The role objects for all the roles that were mentioned in this message */
  mentionedRoles: (DiscordenoRole | undefined)[];
  /** The channel objects for all the channels that were mentioned in this message. */
  mentionedChannels: (DiscordenoChannel | undefined)[];
  /** The member objects for all the members that were mentioned in this message. */
  mentionedMembers: (DiscordenoMember | undefined)[];

  // METHODS

  /** Delete the message */
  delete(reason?: string, delayMilliseconds?: number): ReturnType<typeof deleteMessage>;
  /** Edit the message */
  edit(content: string | EditMessage): ReturnType<typeof editMessage>;
  /** Pins the message in the channel */
  pin(): ReturnType<typeof pinMessage>;
  /** Add a reaction to the message */
  addReaction(reaction: string): ReturnType<typeof addReaction>;
  /** Add multiple reactions to the message without or without order. */
  addReactions(reactions: string[], ordered?: boolean): ReturnType<typeof addReactions>;
  /** Send a inline reply to this message */
  reply(content: string | CreateMessage): ReturnType<typeof sendMessage>;
  /** Send a message to this channel where this message is */
  send(content: string | CreateMessage): ReturnType<typeof sendMessage>;
  /** Send a message to this channel and then delete it after a bit. By default it will delete after 10 seconds with no reason provided. */
  alert(content: string | CreateMessage, timeout?: number, reason?: string): Promise<void>;
  /** Send a inline reply to this message but then delete it after a bit. By default it will delete after 10 seconds with no reason provided.  */
  alertReply(content: string | CreateMessage, timeout?: number, reason?: string): Promise<unknown>;
  /** Removes all reactions for all emojis on this message */
  removeAllReactions(): ReturnType<typeof removeAllReactions>;
  /** Removes all reactions for a single emoji on this message */
  removeReactionEmoji(reaction: string): ReturnType<typeof removeReactionEmoji>;
  /** Removes a reaction from the given user on this message, defaults to bot */
  removeReaction(reaction: string, userId?: bigint): ReturnType<typeof removeReaction>;
  /** Convert to json */
  toJSON(): Message;
}
