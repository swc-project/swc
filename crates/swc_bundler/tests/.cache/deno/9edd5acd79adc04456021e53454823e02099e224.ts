// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/messages/components/button_styles.ts


// TODO: add docs link
export enum DiscordButtonStyles {
  /** A blurple button */
  Primary = 1,
  /** A grey button */
  Secondary,
  /** A green button */
  Success,
  /** A red button */
  Danger,
  /** A button that navigates to a URL */
  Link,
}

export type ButtonStyles = DiscordButtonStyles;
export const ButtonStyles = DiscordButtonStyles;
