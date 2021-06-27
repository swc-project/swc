// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/update_self_voice_state.ts


/** https://discord.com/developers/docs/resources/guild#update-current-user-voice-state */
export interface UpdateSelfVoiceState {
  /** The id of the channel the user is currently in */
  channelId: string;
  /** Toggles the user's suppress state */
  suppress?: boolean;
  /** Sets the user's request to speak */
  requestToSpeakTimestamp?: string | null;
}
