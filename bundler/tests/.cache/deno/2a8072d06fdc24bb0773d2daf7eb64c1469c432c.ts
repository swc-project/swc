// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/util/utils.ts


import { encode } from "./deps.ts";
import { eventHandlers } from "../bot.ts";
import { isActionRow } from "../helpers/type_guards/is_action_row.ts";
import { isButton } from "../helpers/type_guards/is_button.ts";
import { Errors } from "../types/discordeno/errors.ts";
import type { ApplicationCommandOption } from "../types/interactions/commands/application_command_option.ts";
import type { ApplicationCommandOptionChoice } from "../types/interactions/commands/application_command_option_choice.ts";
import { DiscordApplicationCommandOptionTypes } from "../types/interactions/commands/application_command_option_types.ts";
import type { CreateGlobalApplicationCommand } from "../types/interactions/commands/create_global_application_command.ts";
import type { EditGlobalApplicationCommand } from "../types/interactions/commands/edit_global_application_command.ts";
import { ButtonStyles } from "../types/messages/components/button_styles.ts";
import type { MessageComponents } from "../types/messages/components/message_components.ts";
import type { DiscordImageFormat } from "../types/misc/image_format.ts";
import type { DiscordImageSize } from "../types/misc/image_size.ts";
import { SLASH_COMMANDS_NAME_REGEX } from "./constants.ts";
import { validateLength } from "./validate_length.ts";

export async function urlToBase64(url: string) {
  const buffer = await fetch(url).then((res) => res.arrayBuffer());
  const imageStr = encode(buffer);
  const type = url.substring(url.lastIndexOf(".") + 1);
  return `data:image/${type};base64,${imageStr}`;
}

/** Allows easy way to add a prop to a base object when needing to use complicated getters solution. */
// deno-lint-ignore no-explicit-any
export function createNewProp(value: any): PropertyDescriptor {
  return { configurable: true, enumerable: true, writable: true, value };
}

export function delay(ms: number): Promise<void> {
  return new Promise((res): number =>
    setTimeout((): void => {
      res();
    }, ms)
  );
}

export const formatImageURL = (url: string, size: DiscordImageSize = 128, format?: DiscordImageFormat) => {
  return `${url}.${format || (url.includes("/a_") ? "gif" : "jpg")}?size=${size}`;
};

function camelToSnakeCase(text: string) {
  return text.replace(/[A-Z]/g, ($1) => `_${$1.toLowerCase()}`);
}

function snakeToCamelCase(text: string) {
  return text.replace(/([-_][a-z])/gi, ($1) => $1.toUpperCase().replace("_", ""));
}

function isConvertableObject(obj: unknown) {
  return obj === Object(obj) && !Array.isArray(obj) && typeof obj !== "function" && !(obj instanceof Blob);
}

export function snakelize<T>(
  // deno-lint-ignore no-explicit-any
  obj: Record<string, any> | Record<string, any>[]
): T {
  if (isConvertableObject(obj)) {
    // deno-lint-ignore no-explicit-any
    const convertedObject: Record<string, any> = {};

    Object.keys(obj).forEach((key) => {
      eventHandlers.debug?.("loop", `Running forEach loop in snakelize function.`);
      convertedObject[camelToSnakeCase(key)] = snakelize(
        // deno-lint-ignore no-explicit-any
        (obj as Record<string, any>)[key]
      );
    });

    return convertedObject as T;
  } else if (Array.isArray(obj)) {
    obj = obj.map((element) => snakelize(element));
  }

  return obj as T;
}

export function camelize<T>(
  // deno-lint-ignore no-explicit-any
  obj: Record<string, any> | Record<string, any>[]
): T {
  if (isConvertableObject(obj)) {
    // deno-lint-ignore no-explicit-any
    const convertedObject: Record<string, any> = {};

    Object.keys(obj).forEach((key) => {
      eventHandlers.debug?.("loop", `Running forEach loop in camelize function.`);
      convertedObject[snakeToCamelCase(key)] = camelize(
        // deno-lint-ignore no-explicit-any
        (obj as Record<string, any>)[key]
      );
    });

    return convertedObject as T;
  } else if (Array.isArray(obj)) {
    obj = obj.map((element) => camelize(element));
  }

  return obj as T;
}

/** @private */
function validateSlashOptionChoices(
  choices: ApplicationCommandOptionChoice[],
  optionType: DiscordApplicationCommandOptionTypes
) {
  for (const choice of choices) {
    eventHandlers.debug?.("loop", `Running for of loop in validateSlashOptionChoices function.`);
    if (!validateLength(choice.name, { min: 1, max: 100 })) {
      throw new Error(Errors.INVALID_SLASH_OPTION_CHOICE_NAME);
    }

    if (
      optionType === DiscordApplicationCommandOptionTypes.String &&
      (typeof choice.value !== "string" || choice.value.length < 1 || choice.value.length > 100)
    ) {
      throw new Error(Errors.INVALID_SLASH_OPTIONS_CHOICE_VALUE_TYPE);
    }

    if (optionType === DiscordApplicationCommandOptionTypes.Integer && typeof choice.value !== "number") {
      throw new Error(Errors.INVALID_SLASH_OPTIONS_CHOICE_VALUE_TYPE);
    }
  }
}

/** @private */
function validateSlashOptions(options: ApplicationCommandOption[]) {
  const requiredOptions: ApplicationCommandOption[] = [];
  const optionalOptions: ApplicationCommandOption[] = [];

  for (const option of options) {
    eventHandlers.debug?.("loop", `Running for of loop in validateSlashOptions function.`);
    option.name = option.name.toLowerCase();

    if (option.choices?.length) {
      if (option.choices.length > 25) throw new Error(Errors.TOO_MANY_SLASH_OPTION_CHOICES);
      if (
        option.type !== DiscordApplicationCommandOptionTypes.String &&
        option.type !== DiscordApplicationCommandOptionTypes.Integer
      )
        throw new Error(Errors.ONLY_STRING_OR_INTEGER_OPTIONS_CAN_HAVE_CHOICES);
    }

    if (!validateLength(option.name, { min: 1, max: 32 })) throw new Error(Errors.INVALID_SLASH_OPTION_NAME);

    if (!validateLength(option.description, { min: 1, max: 100 }))
      throw new Error(Errors.INVALID_SLASH_OPTION_DESCRIPTION);

    if (option.choices) {
      validateSlashOptionChoices(option.choices, option.type);
    }

    if (option.required) {
      requiredOptions.push(option);
      continue;
    }

    optionalOptions.push(option);
  }

  return [...requiredOptions, ...optionalOptions];
}

export function validateSlashCommands(
  commands: (CreateGlobalApplicationCommand | EditGlobalApplicationCommand)[],
  create = false
) {
  return commands.map((command) => {
    eventHandlers.debug?.("loop", `Running for of loop in validateSlashCommands function.`);
    if (create) {
      if (!command.name) throw new Error(Errors.INVALID_SLASH_NAME);
      if (!command.description) throw new Error(Errors.INVALID_SLASH_DESCRIPTION);
    }

    if (command.name) {
      if (!SLASH_COMMANDS_NAME_REGEX.test(command.name)) {
        throw new Error(Errors.INVALID_SLASH_NAME);
      }

      command.name = command.name.toLowerCase();
    }

    if (command.description && !validateLength(command.description, { min: 1, max: 100 })) {
      throw new Error(Errors.INVALID_SLASH_DESCRIPTION);
    }

    if (command.options?.length) {
      if (command.options.length > 25) {
        throw new Error(Errors.TOO_MANY_SLASH_OPTIONS);
      }

      command.options = validateSlashOptions(command.options);
    }

    return command;
  });
}

// Typescript is not so good as we developers so we need this little utility function to help it out
// Taken from https://fettblog.eu/typescript-hasownproperty/
/** TS save way to check if a property exists in an object */
// deno-lint-ignore ban-types
export function hasOwnProperty<T extends {}, Y extends PropertyKey = string>(
  obj: T,
  prop: Y
): obj is T & Record<Y, unknown> {
  // deno-lint-ignore no-prototype-builtins
  return obj.hasOwnProperty(prop);
}

export function validateComponents(components: MessageComponents) {
  if (!components?.length) return;

  let actionRowCounter = 0;

  for (const component of components) {
    // 5 Link buttons can not have a customId
    if (isButton(component)) {
      if (component.type === ButtonStyles.Link && component.customId) {
        throw new Error(Errors.LINK_BUTTON_CANNOT_HAVE_CUSTOM_ID);
      }
      // Other buttons must have a customId
      if (!component.customId && component.type !== ButtonStyles.Link) {
        throw new Error(Errors.BUTTON_REQUIRES_CUSTOM_ID);
      }

      if (!validateLength(component.label, { max: 80 })) {
        throw new Error(Errors.COMPONENT_LABEL_TOO_BIG);
      }

      if (component.customId && !validateLength(component.customId, { max: 100 })) {
        throw new Error(Errors.COMPONENT_CUSTOM_ID_TOO_BIG);
      }

      if (typeof component.emoji === "string") {
        // A snowflake id was provided
        if (/^[0-9]+$/.test(component.emoji)) {
          component.emoji = {
            id: component.emoji,
          };
        } else {
          // A unicode emoji was provided
          component.emoji = {
            name: component.emoji,
          };
        }
      }
    }

    if (!isActionRow(component)) {
      continue;
    }

    actionRowCounter++;
    // Max of 5 ActionRows per message
    if (actionRowCounter > 5) throw new Error(Errors.TOO_MANY_ACTION_ROWS);

    // Max of 5 Buttons (or any component type) within an ActionRow
    if (component.components?.length > 5) {
      throw new Error(Errors.TOO_MANY_COMPONENTS);
    }
  }
}
