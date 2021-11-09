// Loaded from https://deno.land/x/cliffy@v0.18.0/command/types.ts


import type {
  IDefaultValue,
  IFlagArgument,
  IFlagOptions,
  IFlagValueHandler,
  ITypeHandler,
  ITypeInfo,
} from "../flags/types.ts";
import type { Type } from "./type.ts";
import type { Command } from "./command.ts";

export type { IDefaultValue, IFlagValueHandler, ITypeHandler, ITypeInfo };

type Merge<T, V> = T extends void ? V : (V extends void ? T : T & V);

/* COMMAND TYPES */

/** Description handler. */
export type IDescription<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  A extends Array<unknown> = any,
  // deno-lint-ignore no-explicit-any
  G extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PG extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  P extends Command | undefined = any,
> = string | ((this: Command<O, A, G, PG, P>) => string);

/** Action handler for commands and options. */
export type IAction<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  A extends Array<unknown> = any,
  // deno-lint-ignore no-explicit-any
  G extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PG extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  P extends Command | undefined = any,
> = (
  this: Command<O, A, G, PG, P>,
  options: Merge<Merge<PG, G>, O>,
  ...args: A
) => void | Promise<void>;

/** Argument details. */
export interface IArgument extends IFlagArgument {
  /** Argument name. */
  name: string;
  /** Shell completion action. */
  action: string;
  /** Arguments type. */
  type: string;
}

/** Result of `cmd.parse()` method. */
export interface IParseResult<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  A extends Array<unknown> = any,
  // deno-lint-ignore no-explicit-any
  G extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PG extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  P extends Command | undefined = any,
> {
  options: PG & G & O;
  args: A;
  literal: string[];
  cmd: Command<O, A, G, PG, P>;
}

/* OPTION TYPES */

type ExcludedCommandOptions =
  | "name"
  | "args"
  | "type"
  | "optionalValue"
  | "aliases"
  | "variadic"
  | "list";

/** Command option options. */
export interface ICommandOption<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  A extends Array<unknown> = any,
  // deno-lint-ignore no-explicit-any
  G extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PG extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  P extends Command | undefined = any,
> extends Omit<IFlagOptions, ExcludedCommandOptions> {
  override?: boolean;
  hidden?: boolean;
  global?: boolean;
  action?: IAction<O, A, G, PG, P>;
  prepend?: boolean;
}

/** Command option settings. */
export interface IOption<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  A extends Array<unknown> = any,
  // deno-lint-ignore no-explicit-any
  G extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PG extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  P extends Command | undefined = any,
> extends ICommandOption<O, A, G, PG, P>, IFlagOptions {
  description: string;
  flags: Array<string>;
  typeDefinition?: string;
  args: IArgument[];
}

/* ENV VARS TYPES */

/** Environment variable options */
export interface IEnvVarOptions {
  hidden?: boolean;
  global?: boolean;
}

/** Environment variable settings. */
export interface IEnvVar extends IEnvVarOptions {
  names: string[];
  description: string;
  type: string;
  details: IArgument;
}

/* TYPE TYPES */

/** Type options. */
export interface ITypeOptions {
  override?: boolean;
  global?: boolean;
}

/** Type settings. */
export interface IType extends ITypeOptions {
  name: string;
  handler: Type<unknown> | ITypeHandler<unknown>;
}

/* EXAMPLE TYPES */

/** Example settings. */
export interface IExample {
  name: string;
  description: string;
}

/* COMPLETION TYPES */

/** Completion options. */
export interface ICompleteOptions {
  override?: boolean;
  global?: boolean;
}

/** Completion settings. */
export interface ICompletion<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  A extends Array<unknown> = any,
  // deno-lint-ignore no-explicit-any
  G extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PG extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  P extends Command | undefined = any,
> extends ICompleteOptions {
  name: string;
  complete: ICompleteHandler<O, A, G, PG, P>;
}

/** Type parser method. */
export type ICompleteHandler<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  A extends Array<unknown> = any,
  // deno-lint-ignore no-explicit-any
  G extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PG extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  P extends Command | undefined = any,
> = (
  cmd: Command<O, A, G, PG, P>,
  parent?: Command,
) => string[] | Promise<string[]>;

/** Help callback method to print the help. Invoked by the `--help` option and `help` command and the `.getHelp()` and `.showHelp()` method's. */
export type IHelpHandler<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  A extends Array<unknown> = any,
  // deno-lint-ignore no-explicit-any
  G extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PG extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  P extends Command | undefined = any,
  C extends Command<O, A, G, PG, P> = Command<O, A, G, PG, P>,
> = (this: C, cmd: C) => string;
