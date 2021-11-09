// Loaded from https://deno.land/x/cliffy@v0.18.0/flags/types.ts


/** Parser options. */
export interface IParseOptions {
  flags?: Array<IFlagOptions>;
  parse?: ITypeHandler<unknown>;
  option?: (option: IFlagOptions, value?: unknown) => void;
  knownFlaks?: Record<string, unknown>;
  stopEarly?: boolean;
  allowEmpty?: boolean;
}

/** Flag options. */
export interface IFlagOptions extends IFlagArgument {
  name: string;
  args?: IFlagArgument[];
  aliases?: string[];
  standalone?: boolean;
  default?: IDefaultValue;
  required?: boolean;
  depends?: string[];
  conflicts?: string[];
  value?: IFlagValueHandler;
  collect?: boolean;
}

/** Flag argument definition. */
export interface IFlagArgument {
  type?: OptionType | string;
  optionalValue?: boolean;
  requiredValue?: boolean;
  variadic?: boolean;
  list?: boolean;
  separator?: string;
}

/** Available build-in argument types. */
export enum OptionType {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
}

/** Default flag value */
export type IDefaultValue = unknown | (() => unknown);

/** Value handler for custom value processing. */
// deno-lint-ignore no-explicit-any
export type IFlagValueHandler = (val: any, previous?: any) => any;

/** Result of the parseFlags method. */
export interface IFlagsResult<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> = Record<string, any>,
> {
  flags: O;
  unknown: string[];
  literal: string[];
}

/** Type details. */
export interface ITypeInfo {
  label: string;
  type: string;
  name: string;
  value: string;
}

/** Custom type handler/parser. */
export type ITypeHandler<T = unknown> = (type: ITypeInfo) => T;
