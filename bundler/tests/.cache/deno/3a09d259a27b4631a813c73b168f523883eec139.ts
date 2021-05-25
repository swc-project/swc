// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/gateway/resume.ts


/** https://discord.com/developers/docs/topics/gateway#resume */
export interface Resume {
  /** Session token */
  token: string;
  /** Session id */
  sessionId: string;
  /** Last sequence number received */
  seq: number;
}
