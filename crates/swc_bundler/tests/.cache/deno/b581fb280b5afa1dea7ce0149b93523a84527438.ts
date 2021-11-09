// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/type_guards/is_action_row.ts


import type { ActionRow } from "../../types/messages/components/action_row.ts";
import type { MessageComponent } from "../../types/messages/components/message_components.ts";
import { MessageComponentTypes } from "../../types/messages/components/message_component_types.ts";

/** A type guard function to tell if it is a action row component */
export function isActionRow(component: MessageComponent): component is ActionRow {
  return component.type === MessageComponentTypes.ActionRow;
}
