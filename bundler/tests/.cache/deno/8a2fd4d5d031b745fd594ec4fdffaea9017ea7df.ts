// Loaded from https://deno.land/x/cliffy@v0.18.0/command/_utils.ts


import { didYouMean } from "../flags/_utils.ts";
import {
  ArgumentFollowsVariadicArgument,
  RequiredArgumentFollowsOptionalArgument,
} from "../flags/_errors.ts";
import { OptionType } from "../flags/types.ts";
import type { Command } from "./command.ts";
import type { IArgument } from "./types.ts";

export type PermissionName =
  | "run"
  | "read"
  | "write"
  | "net"
  | "env"
  | "plugin"
  | "hrtime";

export function getPermissions(): Promise<Record<PermissionName, boolean>> {
  return hasPermissions([
    "env",
    "hrtime",
    "net",
    "plugin",
    "read",
    "run",
    "write",
  ]);
}

export function isUnstable(): boolean {
  // deno-lint-ignore no-explicit-any
  return !!(Deno as any).permissions;
}

export function didYouMeanCommand(
  command: string,
  commands: Array<Command>,
  excludes: Array<string> = [],
): string {
  const commandNames = commands
    .map((command) => command.getName())
    .filter((command) => !excludes.includes(command));
  return didYouMean(" Did you mean command", command, commandNames);
}

export async function hasPermission(
  permission: PermissionName,
): Promise<boolean> {
  try {
    // deno-lint-ignore no-explicit-any
    return (await (Deno as any).permissions?.query?.({ name: permission }))
      ?.state === "granted";
  } catch {
    return false;
  }
}

async function hasPermissions<K extends PermissionName>(
  names: K[],
): Promise<Record<K, boolean>> {
  const permissions: Record<string, boolean> = {};
  await Promise.all(
    names.map((name: K) =>
      hasPermission(name).then((hasPermission) =>
        permissions[name] = hasPermission
      )
    ),
  );
  return permissions as Record<K, boolean>;
}

const ARGUMENT_REGEX = /^[<\[].+[\]>]$/;
const ARGUMENT_DETAILS_REGEX = /[<\[:>\]]/;

/**
 * Split options and arguments.
 * @param args Arguments definition: `--color, -c <color1:string> <color2:string>`
 *
 * For example: `-c, --color <color1:string> <color2:string>`
 *
 * Will result in:
 * ```
 * {
 *   flags: [ "-c", "--color" ],
 *   typeDefinition: "<color1:string> <color2:string>"
 * }
 * ```
 */
export function splitArguments(
  args: string,
): { flags: string[]; typeDefinition: string } {
  const parts = args.trim().split(/[, =] */g);
  const typeParts = [];

  while (
    parts[parts.length - 1] &&
    ARGUMENT_REGEX.test(parts[parts.length - 1])
  ) {
    typeParts.unshift(parts.pop());
  }

  const typeDefinition: string = typeParts.join(" ");

  return { flags: parts, typeDefinition };
}

/**
 * Parse arguments string.
 * @param argsDefinition Arguments definition: `<color1:string> <color2:string>`
 */
export function parseArgumentsDefinition(argsDefinition: string): IArgument[] {
  const argumentDetails: IArgument[] = [];

  let hasOptional = false;
  let hasVariadic = false;
  const parts: string[] = argsDefinition.split(/ +/);

  for (const arg of parts) {
    if (hasVariadic) {
      throw new ArgumentFollowsVariadicArgument(arg);
    }

    const parts: string[] = arg.split(ARGUMENT_DETAILS_REGEX);
    const type: string | undefined = parts[2] || OptionType.STRING;

    const details: IArgument = {
      optionalValue: arg[0] !== "<",
      name: parts[1],
      action: parts[3] || type,
      variadic: false,
      list: type ? arg.indexOf(type + "[]") !== -1 : false,
      type,
    };

    if (!details.optionalValue && hasOptional) {
      throw new RequiredArgumentFollowsOptionalArgument(details.name);
    }

    if (arg[0] === "[") {
      hasOptional = true;
    }

    if (details.name.length > 3) {
      const istVariadicLeft = details.name.slice(0, 3) === "...";
      const istVariadicRight = details.name.slice(-3) === "...";

      hasVariadic = details.variadic = istVariadicLeft || istVariadicRight;

      if (istVariadicLeft) {
        details.name = details.name.slice(3);
      } else if (istVariadicRight) {
        details.name = details.name.slice(0, -3);
      }
    }

    if (details.name) {
      argumentDetails.push(details);
    }
  }

  return argumentDetails;
}
