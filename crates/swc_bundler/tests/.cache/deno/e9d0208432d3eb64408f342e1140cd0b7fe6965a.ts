// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/gateway/identify_connection_properties.ts


export interface IdentifyConnectionProperties {
  /** Operating system */
  $os: string;
  /** Library name */
  $browser: string;
  /** Library name */
  $device: string;
}

/** https://discord.com/developers/docs/topics/gateway#identify-identify-connection-properties */
export type DiscordIdentifyConnectionProperties = IdentifyConnectionProperties;
