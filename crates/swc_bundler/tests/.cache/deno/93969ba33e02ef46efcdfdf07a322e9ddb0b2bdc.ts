// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/channels/stage_instance.ts


/** https://discord.com/developers/docs/resources/stage-instance#auto-closing-stage-instance-structure */
export interface StageInstance {
  /** The id of this Stage instance */
  id: string;
  /** The guild id of the associated Stage channel */
  guildId: string;
  /** The id of the associated Stage channel */
  channelId: string;
  /** The topic of the Stage instance (1-120 characters) */
  topic: string;
  /** The privacy level of the Stage instance */
  privacyLevel: number;
  /** Whether or not Stage discovery is disabled */
  discoverableDisabled: boolean;
}
