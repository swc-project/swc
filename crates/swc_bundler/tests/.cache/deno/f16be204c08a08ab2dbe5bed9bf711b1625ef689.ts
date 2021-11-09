// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/messages/components/action_row.ts


import { ButtonComponent } from "./button_component.ts";

// TODO: add docs link
export interface ActionRow {
  /** Action rows are a group of buttons. */
  type: 1;
  /** The button components */
  components: ButtonComponent[];
}
