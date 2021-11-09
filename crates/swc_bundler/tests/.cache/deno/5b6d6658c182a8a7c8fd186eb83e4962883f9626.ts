// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/type_guards/is_button.ts


import type { ButtonComponent } from "../../types/messages/components/button_component.ts";
import type { MessageComponent } from "../../types/messages/components/message_components.ts";
import { MessageComponentTypes } from "../../types/messages/components/message_component_types.ts";

/** A type guard function to tell if it is a button component */
export function isButton(component: MessageComponent): component is ButtonComponent {
  return component.type === MessageComponentTypes.Button;
}
