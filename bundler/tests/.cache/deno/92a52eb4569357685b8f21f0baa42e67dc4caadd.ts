// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/messages/components/message_components.ts


import { ActionRow } from "./action_row.ts";
import { ButtonComponent } from "./button_component.ts";

export type MessageComponent = ActionRow | ButtonComponent;

export type MessageComponents = MessageComponent[];
