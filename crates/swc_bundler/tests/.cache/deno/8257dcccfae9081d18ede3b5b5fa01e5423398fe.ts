// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/activity/activity_button.ts


// https://github.com/discord/discord-api-docs/pull/2219
// TODO: add documentation link
export interface ActivityButton {
  /** The text shown on the button (1-32 characters) */
  label: string;
  /** The url opened when clicking the button (1-512 characters) */
  url: string;
}
