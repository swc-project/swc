// Loaded from https://deno.land/x/cliffy@v0.18.0/command/command.ts


import {
  DuplicateOptionName,
  UnknownType,
  ValidationError,
} from "../flags/_errors.ts";
import { parseFlags } from "../flags/flags.ts";
import type { IFlagOptions, IFlagsResult } from "../flags/types.ts";
import {
  getPermissions,
  hasPermission,
  isUnstable,
  parseArgumentsDefinition,
  splitArguments,
} from "./_utils.ts";
import type { PermissionName } from "./_utils.ts";
import { bold, existsSync, red } from "./deps.ts";
import {
  CommandExecutableNotFound,
  CommandNotFound,
  DefaultCommandNotFound,
  DuplicateCommandAlias,
  DuplicateCommandName,
  DuplicateCompletion,
  DuplicateEnvironmentVariable,
  DuplicateExample,
  DuplicateType,
  EnvironmentVariableOptionalValue,
  EnvironmentVariableSingleValue,
  EnvironmentVariableVariadicValue,
  MissingArgument,
  MissingArguments,
  MissingCommandName,
  NoArgumentsAllowed,
  TooManyArguments,
  UnknownCommand,
} from "./_errors.ts";
import { BooleanType } from "./types/boolean.ts";
import { NumberType } from "./types/number.ts";
import { StringType } from "./types/string.ts";
import { Type } from "./type.ts";
import { HelpGenerator } from "./help/_help_generator.ts";
import type { HelpOptions } from "./help/_help_generator.ts";
import type {
  IAction,
  IArgument,
  ICommandOption,
  ICompleteHandler,
  ICompleteOptions,
  ICompletion,
  IDescription,
  IEnvVar,
  IEnvVarOptions,
  IExample,
  IFlagValueHandler,
  IHelpHandler,
  IOption,
  IParseResult,
  IType,
  ITypeHandler,
  ITypeInfo,
  ITypeOptions,
} from "./types.ts";

interface IDefaultOption<
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
  flags: string;
  desc?: string;
  opts?: ICommandOption<O, A, G, PG, P>;
}

type ITypeMap = Map<string, IType>;
type OneOf<T, V> = T extends void ? V : T;
type Merge<T, V> = T extends void ? V : (V extends void ? T : T & V);

export class Command<
  // deno-lint-ignore no-explicit-any
  CO extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  CA extends Array<unknown> = CO extends number ? any : [],
  // deno-lint-ignore no-explicit-any
  CG extends Record<string, any> | void = CO extends number ? any : void,
  // deno-lint-ignore no-explicit-any
  PG extends Record<string, any> | void = CO extends number ? any : void,
  // deno-lint-ignore no-explicit-any
  P extends Command | undefined = CO extends number ? any : undefined,
> {
  private types: ITypeMap = new Map<string, IType>([
    ["string", { name: "string", handler: new StringType() }],
    ["number", { name: "number", handler: new NumberType() }],
    ["boolean", { name: "boolean", handler: new BooleanType() }],
  ]);
  private rawArgs: string[] = [];
  private literalArgs: string[] = [];
  // @TODO: get script name: https://github.com/denoland/deno/pull/5034
  // private name: string = location.pathname.split( '/' ).pop() as string;
  private _name = "COMMAND";
  private _parent?: P;
  private _globalParent?: Command;
  private ver?: string;
  private desc: IDescription = "";
  private fn?: IAction;
  private options: IOption[] = [];
  private commands: Map<string, Command> = new Map();
  private examples: IExample[] = [];
  private envVars: IEnvVar[] = [];
  private aliases: string[] = [];
  private completions: Map<string, ICompletion> = new Map();
  private cmd: Command = this;
  private argsDefinition?: string;
  private isExecutable = false;
  private throwOnError = false;
  private _allowEmpty = true;
  private _stopEarly = false;
  private defaultCommand?: string;
  private _useRawArgs = false;
  private args: IArgument[] = [];
  private isHidden = false;
  private isGlobal = false;
  private hasDefaults = false;
  private _versionOption?: IDefaultOption | false;
  private _helpOption?: IDefaultOption | false;
  private _help?: IHelpHandler;

  /** Disable version option. */
  public versionOption(enable: false): this;
  /**
   * Set global version option.
   * @param flags The flags of the version option.
   * @param desc  The description of the version option.
   * @param opts  Version option options.
   */
  public versionOption(
    flags: string,
    desc?: string,
    opts?: ICommandOption<Partial<CO>, CA, CG, PG, P> & { global: true },
  ): this;
  /**
   * Set version option.
   * @param flags The flags of the version option.
   * @param desc  The description of the version option.
   * @param opts  Version option options.
   */
  public versionOption(
    flags: string,
    desc?: string,
    opts?: ICommandOption<CO, CA, CG, PG, P>,
  ): this;
  /**
   * Set version option.
   * @param flags The flags of the version option.
   * @param desc  The description of the version option.
   * @param opts  The action of the version option.
   */
  public versionOption(
    flags: string,
    desc?: string,
    opts?: IAction<CO, CA, CG, PG, P>,
  ): this;
  public versionOption(
    flags: string | false,
    desc?: string,
    opts?:
      | IAction<CO, CA, CG, PG, P>
      | ICommandOption<CO, CA, CG, PG, P>
      | ICommandOption<Partial<CO>, CA, CG, PG, P> & { global: true },
  ): this {
    this._versionOption = flags === false ? flags : {
      flags,
      desc,
      opts: typeof opts === "function" ? { action: opts } : opts,
    };
    return this;
  }

  /** Disable help option. */
  public helpOption(enable: false): this;
  /**
   * Set global help option.
   * @param flags The flags of the help option.
   * @param desc  The description of the help option.
   * @param opts  Help option options.
   */
  public helpOption(
    flags: string,
    desc?: string,
    opts?: ICommandOption<Partial<CO>, CA, CG, PG, P> & { global: true },
  ): this;
  /**
   * Set help option.
   * @param flags The flags of the help option.
   * @param desc  The description of the help option.
   * @param opts  Help option options.
   */
  public helpOption(
    flags: string,
    desc?: string,
    opts?: ICommandOption<CO, CA, CG, PG, P>,
  ): this;
  /**
   * Set help option.
   * @param flags The flags of the help option.
   * @param desc  The description of the help option.
   * @param opts  The action of the help option.
   */
  public helpOption(
    flags: string,
    desc?: string,
    opts?: IAction<CO, CA, CG, PG, P>,
  ): this;
  public helpOption(
    flags: string | false,
    desc?: string,
    opts?:
      | IAction<CO, CA, CG, PG, P>
      | ICommandOption<CO, CA, CG, PG, P>
      | ICommandOption<Partial<CO>, CA, CG, PG, P> & { global: true },
  ): this {
    this._helpOption = flags === false ? flags : {
      flags,
      desc,
      opts: typeof opts === "function" ? { action: opts } : opts,
    };
    return this;
  }

  /**
   * Add new sub-command.
   * @param name      Command definition. E.g: `my-command <input-file:string> <output-file:string>`
   * @param cmd       The new child command to register.
   * @param override  Override existing child command.
   */
  public command<
    C extends (CO extends number ? Command : Command<
      // deno-lint-ignore no-explicit-any
      Record<string, any> | void,
      Array<unknown>,
      // deno-lint-ignore no-explicit-any
      Record<string, any> | void,
      Merge<PG, CG> | void | undefined,
      OneOf<P, this> | undefined
    >),
  >(
    name: string,
    cmd: C,
    override?: boolean,
    // deno-lint-ignore no-explicit-any
  ): C extends Command<infer O, infer A, infer G, any, any>
    ? Command<O, A, G, Merge<PG, CG>, OneOf<P, this>>
    : never;
  /**
   * Add new sub-command.
   * @param name      Command definition. E.g: `my-command <input-file:string> <output-file:string>`
   * @param desc      The description of the new child command.
   * @param override  Override existing child command.
   */
  public command<
    // deno-lint-ignore no-explicit-any
    A extends Array<unknown> = Array<any>,
  >(
    name: string,
    desc?: string,
    override?: boolean,
  ): Command<
    // deno-lint-ignore no-explicit-any
    CO extends number ? any : void,
    A,
    // deno-lint-ignore no-explicit-any
    CO extends number ? any : void,
    Merge<PG, CG>,
    OneOf<P, this>
  >;
  /**
   * Add new sub-command.
   * @param nameAndArguments  Command definition. E.g: `my-command <input-file:string> <output-file:string>`
   * @param cmdOrDescription  The description of the new child command.
   * @param override          Override existing child command.
   */
  command(
    nameAndArguments: string,
    cmdOrDescription?: Command | string,
    override?: boolean,
  ): Command {
    const result = splitArguments(nameAndArguments);

    const name: string | undefined = result.flags.shift();
    const aliases: string[] = result.flags;

    if (!name) {
      throw new MissingCommandName();
    }

    if (this.getBaseCommand(name, true)) {
      if (!override) {
        throw new DuplicateCommandName(name);
      }
      this.removeCommand(name);
    }

    let description: string | undefined;
    let cmd: Command;

    if (typeof cmdOrDescription === "string") {
      description = cmdOrDescription;
    }

    if (cmdOrDescription instanceof Command) {
      cmd = cmdOrDescription.reset();
    } else {
      cmd = new Command();
    }

    cmd._name = name;
    cmd._parent = this;

    if (description) {
      cmd.description(description);
    }

    if (result.typeDefinition) {
      cmd.arguments(result.typeDefinition);
    }

    // if (name === "*" && !cmd.isExecutable) {
    //   cmd.isExecutable = true;
    // }

    aliases.forEach((alias) => cmd.aliases.push(alias));

    this.commands.set(name, cmd);

    this.select(name);

    return this;
  }

  // public static async exists(name: string) {
  //   const proc = Deno.run({
  //     cmd: ["sh", "-c", "compgen -c"],
  //     stdout: "piped",
  //     stderr: "piped",
  //   });
  //   const output: Uint8Array = await proc.output();
  //   const commands = new TextDecoder().decode(output)
  //     .trim()
  //     .split("\n");
  //
  //   return commands.indexOf(name) !== -1;
  // }

  /**
   * Add new command alias.
   * @param alias Tha name of the alias.
   */
  public alias(alias: string): this {
    if (this.cmd.aliases.indexOf(alias) !== -1) {
      throw new DuplicateCommandAlias(alias);
    }

    this.cmd.aliases.push(alias);

    return this;
  }

  /** Reset internal command reference to main command. */
  public reset(): OneOf<P, this> {
    this.cmd = this;
    return this as OneOf<P, this>;
  }

  /**
   * Set internal command pointer to child command with given name.
   * @param name The name of the command to select.
   */
  public select<
    // deno-lint-ignore no-explicit-any
    O extends Record<string, unknown> | void = any,
    // deno-lint-ignore no-explicit-any
    A extends Array<unknown> = any,
    // deno-lint-ignore no-explicit-any
    G extends Record<string, unknown> | void = any,
  >(name: string): Command<O, A, G, PG, P> {
    const cmd = this.getBaseCommand(name, true);

    if (!cmd) {
      throw new CommandNotFound(name, this.getBaseCommands(true));
    }

    this.cmd = cmd;

    return this as Command as Command<O, A, G, PG, P>;
  }

  /*****************************************************************************
   **** SUB HANDLER ************************************************************
   *****************************************************************************/

  /** Set command name. */
  public name(name: string): this {
    this.cmd._name = name;
    return this;
  }

  /**
   * Set command version.
   * @param version Semantic version string.
   */
  public version(version: string): this {
    this.cmd.ver = version;
    return this;
  }

  public help(
    help:
      | string
      | ((this: Command<Partial<CO>, Partial<CA>, CG, PG>) => string)
      | HelpOptions,
  ): this {
    if (typeof help === "string") {
      this.cmd._help = () => help;
    } else if (typeof help === "function") {
      this.cmd._help = help;
    } else {
      this.cmd._help = (cmd: Command): string =>
        HelpGenerator.generate(cmd, help);
    }
    return this;
  }

  /**
   * Set the long command description.
   * @param description The command description.
   */
  public description(description: IDescription<CO, CA, CG, PG, P>): this {
    this.cmd.desc = description;
    return this;
  }

  /**
   * Hide command from help, completions, etc.
   */
  public hidden(): this {
    this.cmd.isHidden = true;
    return this;
  }

  /** Make command globally available. */
  public global(): this {
    this.cmd.isGlobal = true;
    return this;
  }

  /** Make command executable. */
  public executable(): this {
    this.cmd.isExecutable = true;
    return this;
  }

  /**
   * Set command arguments:
   *
   *   <requiredArg:string> [optionalArg: number] [...restArgs:string]
   */
  public arguments<A extends Array<unknown> = CA>(
    args: string,
  ): Command<CO, A, CG, PG, P> {
    this.cmd.argsDefinition = args;
    return this as Command as Command<CO, A, CG, PG, P>;
  }

  /**
   * Set command callback method.
   * @param fn Command action handler.
   */
  public action(fn: IAction<CO, CA, CG, PG, P>): this {
    this.cmd.fn = fn;
    return this;
  }

  /**
   * Don't throw an error if the command was called without arguments.
   * @param allowEmpty Enable/disable allow empty.
   */
  public allowEmpty(allowEmpty = true): this {
    this.cmd._allowEmpty = allowEmpty;
    return this;
  }

  /**
   * Enable stop early. If enabled, all arguments starting from the first non
   * option argument will be passed as arguments with type string to the command
   * action handler.
   *
   * For example:
   *     `command --debug-level warning server --port 80`
   *
   * Will result in:
   *     - options: `{debugLevel: 'warning'}`
   *     - args: `['server', '--port', '80']`
   *
   * @param stopEarly Enable/disable stop early.
   */
  public stopEarly(stopEarly = true): this {
    this.cmd._stopEarly = stopEarly;
    return this;
  }

  /**
   * Disable parsing arguments. If enabled the raw arguments will be passed to
   * the action handler. This has no effect for parent or child commands. Only
   * for the command on which this method was called.
   * @param useRawArgs Enable/disable raw arguments.
   */
  public useRawArgs(useRawArgs = true): Command<CO, Array<string>, CG, PG, P> {
    this.cmd._useRawArgs = useRawArgs;
    return this as Command<CO, Array<string>, CG, PG, P>;
  }

  /**
   * Set default command. The default command is executed when the program
   * was called without any argument and if no action handler is registered.
   * @param name Name of the default command.
   */
  public default(name: string): this {
    this.cmd.defaultCommand = name;
    return this;
  }

  public globalType(
    name: string,
    type: Type<unknown> | ITypeHandler<unknown>,
    options?: Omit<ITypeOptions, "global">,
  ): this {
    return this.type(name, type, { ...options, global: true });
  }

  /**
   * Register custom type.
   * @param name    The name of the type.
   * @param handler The callback method to parse the type.
   * @param options Type options.
   */
  public type(
    name: string,
    handler: Type<unknown> | ITypeHandler<unknown>,
    options?: ITypeOptions,
  ): this {
    if (this.cmd.types.get(name) && !options?.override) {
      throw new DuplicateType(name);
    }

    this.cmd.types.set(name, { ...options, name, handler });

    if (handler instanceof Type && typeof handler.complete !== "undefined") {
      this.complete(
        name,
        (cmd, parent?: Command) => handler.complete?.(cmd, parent) || [],
        options,
      );
    }

    return this;
  }

  public globalComplete(
    name: string,
    complete: ICompleteHandler,
    options?: Omit<ICompleteOptions, "global">,
  ): this {
    return this.complete(name, complete, { ...options, global: true });
  }

  /**
   * Register command specific custom type.
   * @param name      The name of the completion.
   * @param complete  The callback method to complete the type.
   * @param options   Complete options.
   */
  public complete(
    name: string,
    // deno-lint-ignore no-explicit-any
    complete: ICompleteHandler<Partial<CO>, Partial<CA>, CG, PG, any>,
    options: ICompleteOptions & { global: boolean },
  ): this;
  public complete(
    name: string,
    complete: ICompleteHandler<CO, CA, CG, PG, P>,
    options?: ICompleteOptions,
  ): this;
  complete(
    name: string,
    complete: ICompleteHandler<CO, CA, CG, PG, P>,
    options?: ICompleteOptions,
  ): this {
    if (this.cmd.completions.has(name) && !options?.override) {
      throw new DuplicateCompletion(name);
    }

    this.cmd.completions.set(name, {
      name,
      complete,
      ...options,
    });

    return this;
  }

  /**
   * Throw validation error's instead of calling `Deno.exit()` to handle
   * validation error's manually.
   *
   * A validation error is thrown when the command is wrongly used by the user.
   * For example: If the user passes some invalid options or arguments to the
   * command.
   *
   * This has no effect for parent commands. Only for the command on which this
   * method was called and all child commands.
   *
   * **Example:**
   *
   * ```
   * try {
   *   cmd.parse();
   * } catch(error) {
   *   if (error instanceof ValidationError) {
   *     cmd.showHelp();
   *     Deno.exit(1);
   *   }
   *   throw error;
   * }
   * ```
   *
   * @see ValidationError
   */
  public throwErrors(): this {
    this.cmd.throwOnError = true;
    return this;
  }

  /** Check whether the command should throw errors or exit. */
  protected shouldThrowErrors(): boolean {
    return this.cmd.throwOnError || !!this.cmd._parent?.shouldThrowErrors();
  }

  public globalOption<G extends Record<string, unknown> | void = CG>(
    flags: string,
    desc: string,
    opts?:
      | Omit<ICommandOption<Partial<CO>, CA, Merge<CG, G>, PG, P>, "global">
      | IFlagValueHandler,
  ): Command<CO, CA, Merge<CG, G>, PG, P> {
    if (typeof opts === "function") {
      return this.option(flags, desc, { value: opts, global: true });
    }
    return this.option(flags, desc, { ...opts, global: true });
  }

  /**
   * Add a new option.
   * @param flags Flags string like: -h, --help, --manual <requiredArg:string> [optionalArg: number] [...restArgs:string]
   * @param desc Flag description.
   * @param opts Flag options or custom handler for processing flag value.
   */
  public option<G extends Record<string, unknown> | void = CG>(
    flags: string,
    desc: string,
    opts:
      | ICommandOption<Partial<CO>, CA, Merge<CG, G>, PG, P> & { global: true }
      | IFlagValueHandler,
  ): Command<CO, CA, Merge<CG, G>, PG, P>;
  public option<O extends Record<string, unknown> | void = CO>(
    flags: string,
    desc: string,
    opts?:
      | ICommandOption<Merge<CO, O>, CA, CG, PG, P>
      | IFlagValueHandler,
  ): Command<Merge<CO, O>, CA, CG, PG, P>;
  public option(
    flags: string,
    desc: string,
    opts?: ICommandOption | IFlagValueHandler,
  ): Command {
    if (typeof opts === "function") {
      return this.option(flags, desc, { value: opts });
    }

    const result = splitArguments(flags);

    const args: IArgument[] = result.typeDefinition
      ? parseArgumentsDefinition(result.typeDefinition)
      : [];

    const option: IOption = {
      ...opts,
      name: "",
      description: desc,
      args,
      flags: result.flags,
      typeDefinition: result.typeDefinition,
    };

    if (option.separator) {
      for (const arg of args) {
        if (arg.list) {
          arg.separator = option.separator;
        }
      }
    }

    for (const part of option.flags) {
      const arg = part.trim();
      const isLong = /^--/.test(arg);

      const name = isLong ? arg.slice(2) : arg.slice(1);

      if (
        option.name === name || option.aliases && ~option.aliases.indexOf(name)
      ) {
        throw new DuplicateOptionName(name);
      }

      if (!option.name && isLong) {
        option.name = name;
      } else if (!option.aliases) {
        option.aliases = [name];
      } else {
        option.aliases.push(name);
      }

      if (this.cmd.getBaseOption(name, true)) {
        if (opts?.override) {
          this.removeOption(name);
        } else {
          throw new DuplicateOptionName(name);
        }
      }
    }

    if (option.prepend) {
      this.cmd.options.unshift(option);
    } else {
      this.cmd.options.push(option);
    }

    return this;
  }

  /**
   * Add new command example.
   * @param name          Name of the example.
   * @param description   The content of the example.
   */
  public example(name: string, description: string): this {
    if (this.cmd.hasExample(name)) {
      throw new DuplicateExample(name);
    }

    this.cmd.examples.push({ name, description });

    return this;
  }

  public globalEnv(
    name: string,
    description: string,
    options?: Omit<IEnvVarOptions, "global">,
  ): this {
    return this.env(name, description, { ...options, global: true });
  }

  /**
   * Add new environment variable.
   * @param name          Name of the environment variable.
   * @param description   The description of the environment variable.
   * @param options       Environment variable options.
   */
  public env(
    name: string,
    description: string,
    options?: IEnvVarOptions,
  ): this {
    const result = splitArguments(name);

    if (!result.typeDefinition) {
      result.typeDefinition = "<value:boolean>";
    }

    if (result.flags.some((envName) => this.cmd.getBaseEnvVar(envName, true))) {
      throw new DuplicateEnvironmentVariable(name);
    }

    const details: IArgument[] = parseArgumentsDefinition(
      result.typeDefinition,
    );

    if (details.length > 1) {
      throw new EnvironmentVariableSingleValue(name);
    } else if (details.length && details[0].optionalValue) {
      throw new EnvironmentVariableOptionalValue(name);
    } else if (details.length && details[0].variadic) {
      throw new EnvironmentVariableVariadicValue(name);
    }

    this.cmd.envVars.push({
      names: result.flags,
      description,
      type: details[0].type,
      details: details.shift() as IArgument,
      ...options,
    });

    return this;
  }

  /*****************************************************************************
   **** MAIN HANDLER ***********************************************************
   *****************************************************************************/

  /**
   * Parse command line arguments and execute matched command.
   * @param args Command line args to parse. Ex: `cmd.parse( Deno.args )`
   * @param dry Execute command after parsed.
   */
  public async parse(
    args: string[] = Deno.args,
    dry?: boolean,
  ): Promise<IParseResult<CO, CA, CG, PG, P>> {
    try {
      this.reset();
      this.registerDefaults();
      this.rawArgs = args;
      const subCommand = args.length > 0 &&
        this.getCommand(args[0], true);

      if (subCommand) {
        subCommand._globalParent = this;
        return await subCommand.parse(
          this.rawArgs.slice(1),
          dry,
        ) as IParseResult<CO, CA, CG, PG, P>;
      }

      const result: IParseResult<CO, CA, CG, PG, P> = {
        options: {} as PG & CG & CO,
        args: this.rawArgs as CA,
        cmd: this,
        literal: this.literalArgs,
      };

      if (this.isExecutable) {
        if (!dry) {
          await this.executeExecutable(this.rawArgs);
        }

        return result;
      } else if (this._useRawArgs) {
        if (dry) {
          return result;
        }

        return await this.execute({} as PG & CG & CO, ...this.rawArgs as CA);
      } else {
        const { action, flags, unknown, literal } = this.parseFlags(
          this.rawArgs,
        );

        this.literalArgs = literal;

        const params = this.parseArguments(unknown, flags);

        await this.validateEnvVars();

        if (dry || action) {
          if (action) {
            await action.call(this, flags, ...params);
          }
          return {
            options: flags as PG & CG & CO,
            args: params,
            cmd: this,
            literal: this.literalArgs,
          };
        }

        return await this.execute(flags as PG & CG & CO, ...params);
      }
    } catch (error) {
      throw this.error(error);
    }
  }

  /** Register default options like `--version` and `--help`. */
  private registerDefaults(): this {
    if (this.hasDefaults || this.getParent()) {
      return this;
    }
    this.hasDefaults = true;

    this.reset();

    if (!this._help) {
      this.help({
        hints: true,
        types: false,
      });
    }

    if (this.ver && this._versionOption !== false) {
      this.option(
        this._versionOption?.flags || "-V, --version",
        this._versionOption?.desc ||
          "Show the version number for this program.",
        {
          standalone: true,
          prepend: true,
          action: async function () {
            await Deno.stdout.write(
              new TextEncoder().encode(this.ver + "\n"),
            );
            Deno.exit(0);
          },
          ...(this._versionOption?.opts ?? {}),
        },
      );
    }

    if (this._helpOption !== false) {
      this.option(
        this._helpOption?.flags || "-h, --help",
        this._helpOption?.desc || "Show this help.",
        {
          standalone: true,
          global: true,
          prepend: true,
          action: function () {
            this.showHelp();
            Deno.exit(0);
          },
          ...(this._helpOption?.opts ?? {}),
        },
      );
    }

    return this;
  }

  /**
   * Execute command.
   * @param options A map of options.
   * @param args Command arguments.
   */
  protected async execute(
    options: PG & CG & CO,
    ...args: CA
  ): Promise<IParseResult<CO, CA, CG, PG, P>> {
    if (this.fn) {
      await this.fn(options, ...args);
    } else if (this.defaultCommand) {
      const cmd = this.getCommand(this.defaultCommand, true);

      if (!cmd) {
        throw new DefaultCommandNotFound(
          this.defaultCommand,
          this.getCommands(),
        );
      }

      cmd._globalParent = this;
      await cmd.execute(options, ...args);
    }

    return { options, args, cmd: this, literal: this.literalArgs };
  }

  /**
   * Execute external sub-command.
   * @param args Raw command line arguments.
   */
  protected async executeExecutable(args: string[]) {
    const permissions = await getPermissions();
    if (!permissions.read) {
      // deno-lint-ignore no-explicit-any
      await (Deno as any).permissions?.request({ name: "read" });
    }
    if (!permissions.run) {
      // deno-lint-ignore no-explicit-any
      await (Deno as any).permissions?.request({ name: "run" });
    }

    const [main, ...names] = this.getPath().split(" ");

    names.unshift(main.replace(/\.ts$/, ""));

    const executableName = names.join("-");
    const files: string[] = [];

    // deno-lint-ignore no-explicit-any
    const parts: string[] = (Deno as any).mainModule.replace(/^file:\/\//g, "")
      .split("/");
    parts.pop();
    const path: string = parts.join("/");
    files.push(
      path + "/" + executableName,
      path + "/" + executableName + ".ts",
    );

    files.push(
      executableName,
      executableName + ".ts",
    );

    const denoOpts = [];

    if (isUnstable()) {
      denoOpts.push("--unstable");
    }

    denoOpts.push(
      "--allow-read",
      "--allow-run",
    );

    (Object.keys(permissions) as PermissionName[])
      .forEach((name: PermissionName) => {
        if (name === "read" || name === "run") {
          return;
        }
        if (permissions[name]) {
          denoOpts.push(`--allow-${name}`);
        }
      });

    for (const file of files) {
      if (!existsSync(file)) {
        continue;
      }

      const cmd = ["deno", "run", ...denoOpts, file, ...args];

      const process: Deno.Process = Deno.run({
        cmd: cmd,
      });

      const status: Deno.ProcessStatus = await process.status();

      if (!status.success) {
        Deno.exit(status.code);
      }

      return;
    }

    throw new CommandExecutableNotFound(executableName, files);
  }

  /**
   * Parse raw command line arguments.
   * @param args Raw command line arguments.
   */
  protected parseFlags(
    args: string[],
  ): IFlagsResult & { action?: IAction } {
    let action: IAction | undefined;
    const result = parseFlags(args, {
      stopEarly: this._stopEarly,
      allowEmpty: this._allowEmpty,
      flags: this.getOptions(true),
      parse: (type: ITypeInfo) => this.parseType(type),
      option: (option: IFlagOptions) => {
        if (!action && (option as IOption).action) {
          action = (option as IOption).action;
        }
      },
    });
    return { ...result, action };
  }

  /** Parse argument type. */
  protected parseType(type: ITypeInfo): unknown {
    const typeSettings: IType | undefined = this.getType(type.type);

    if (!typeSettings) {
      throw new UnknownType(
        type.type,
        this.getTypes().map((type) => type.name),
      );
    }

    return typeSettings.handler instanceof Type
      ? typeSettings.handler.parse(type)
      : typeSettings.handler(type);
  }

  /** Validate environment variables. */
  protected async validateEnvVars(): Promise<void> {
    if (!await hasPermission("env")) {
      return;
    }

    const envVars = this.getEnvVars(true);

    if (!envVars.length) {
      return;
    }

    envVars.forEach((env: IEnvVar) => {
      const name = env.names.find((name) => !!Deno.env.get(name));
      if (name) {
        this.parseType({
          label: "Environment variable",
          type: env.type,
          name,
          value: Deno.env.get(name) ?? "",
        });
      }
    });
  }

  /**
   * Parse command-line arguments.
   * @param args  Raw command line arguments.
   * @param flags Parsed command line options.
   */
  protected parseArguments(args: string[], flags: Record<string, unknown>): CA {
    const params: Array<unknown> = [];

    // remove array reference
    args = args.slice(0);

    if (!this.hasArguments()) {
      if (args.length) {
        if (this.hasCommands(true)) {
          throw new UnknownCommand(args[0], this.getCommands());
        } else {
          throw new NoArgumentsAllowed(this.getPath());
        }
      }
    } else {
      if (!args.length) {
        const required = this.getArguments()
          .filter((expectedArg) => !expectedArg.optionalValue)
          .map((expectedArg) => expectedArg.name);

        if (required.length) {
          const flagNames: string[] = Object.keys(flags);
          const hasStandaloneOption = !!flagNames.find((name) =>
            this.getOption(name, true)?.standalone
          );

          if (!hasStandaloneOption) {
            throw new MissingArguments(required);
          }
        }
      } else {
        for (const expectedArg of this.getArguments()) {
          if (!args.length) {
            if (expectedArg.optionalValue) {
              break;
            }
            throw new MissingArgument(`Missing argument: ${expectedArg.name}`);
          }

          let arg: unknown;

          if (expectedArg.variadic) {
            arg = args.splice(0, args.length)
              .map((value) =>
                this.parseType({
                  label: "Argument",
                  type: expectedArg.type,
                  name: expectedArg.name,
                  value,
                })
              );
          } else {
            arg = this.parseType({
              label: "Argument",
              type: expectedArg.type,
              name: expectedArg.name,
              value: args.shift() as string,
            });
          }

          if (arg) {
            params.push(arg);
          }
        }

        if (args.length) {
          throw new TooManyArguments(args);
        }
      }
    }

    return params as CA;
  }

  /**
   * Handle error. If `throwErrors` is enabled the error will be returned,
   * otherwise a formatted error message will be printed and `Deno.exit(1)`
   * will be called.
   * @param error Error to handle.
   */
  protected error(error: Error): Error {
    if (this.shouldThrowErrors() || !(error instanceof ValidationError)) {
      return error;
    }
    this.showHelp();
    Deno.stderr.writeSync(
      new TextEncoder().encode(
        red(`  ${bold("error")}: ${error.message}\n`) + "\n",
      ),
    );
    Deno.exit(1);
  }

  /*****************************************************************************
   **** GETTER *****************************************************************
   *****************************************************************************/

  /** Get command name. */
  public getName(): string {
    return this._name;
  }

  /** Get parent command. */
  public getParent(): P {
    return this._parent as P;
  }

  /**
   * Get parent command from global executed command.
   * Be sure, to call this method only inside an action handler. Unless this or any child command was executed,
   * this method returns always undefined.
   */
  public getGlobalParent(): Command | undefined {
    return this._globalParent;
  }

  /** Get main command. */
  public getMainCommand(): Command {
    return this._parent?.getMainCommand() ?? this;
  }

  /** Get command name aliases. */
  public getAliases(): string[] {
    return this.aliases;
  }

  /** Get full command path. */
  public getPath(): string {
    return this._parent
      ? this._parent.getPath() + " " + this._name
      : this._name;
  }

  /** Get arguments definition. E.g: <input-file:string> <output-file:string> */
  public getArgsDefinition(): string | undefined {
    return this.argsDefinition;
  }

  /**
   * Get argument by name.
   * @param name Name of the argument.
   */
  public getArgument(name: string): IArgument | undefined {
    return this.getArguments().find((arg) => arg.name === name);
  }

  /** Get arguments. */
  public getArguments(): IArgument[] {
    if (!this.args.length && this.argsDefinition) {
      this.args = parseArgumentsDefinition(this.argsDefinition);
    }

    return this.args;
  }

  /** Check if command has arguments. */
  public hasArguments() {
    return !!this.argsDefinition;
  }

  /** Get command version. */
  public getVersion(): string | undefined {
    return this.ver ?? this._parent?.getVersion();
  }

  /** Get command description. */
  public getDescription(): string {
    // call description method only once
    return typeof this.desc === "function"
      ? this.desc = this.desc()
      : this.desc;
  }

  /** Get short command description. This is the first line of the description. */
  public getShortDescription(): string {
    return this.getDescription()
      .trim()
      .split("\n")
      .shift() as string;
  }

  /** Get original command-line arguments. */
  public getRawArgs(): string[] {
    return this.rawArgs;
  }

  /** Get all arguments defined after the double dash. */
  public getLiteralArgs(): string[] {
    return this.literalArgs;
  }

  /** Output generated help without exiting. */
  public showHelp() {
    Deno.stdout.writeSync(new TextEncoder().encode(this.getHelp()));
  }

  /** Get generated help. */
  public getHelp(): string {
    this.registerDefaults();
    return this.getHelpHandler().call(this, this);
  }

  /** Get generated help. */
  private getHelpHandler(): IHelpHandler {
    return this._help ?? this._parent?.getHelpHandler() as IHelpHandler;
  }

  /*****************************************************************************
   **** Object GETTER **********************************************************
   *****************************************************************************/

  /**
   * Checks whether the command has options or not.
   * @param hidden Include hidden options.
   */
  public hasOptions(hidden?: boolean): boolean {
    return this.getOptions(hidden).length > 0;
  }

  /**
   * Get options.
   * @param hidden Include hidden options.
   */
  public getOptions(hidden?: boolean): IOption[] {
    return this.getGlobalOptions(hidden).concat(this.getBaseOptions(hidden));
  }

  /**
   * Get base options.
   * @param hidden Include hidden options.
   */
  public getBaseOptions(hidden?: boolean): IOption[] {
    if (!this.options.length) {
      return [];
    }

    return hidden
      ? this.options.slice(0)
      : this.options.filter((opt) => !opt.hidden);
  }

  /**
   * Get global options.
   * @param hidden Include hidden options.
   */
  public getGlobalOptions(hidden?: boolean): IOption[] {
    const getOptions = (
      cmd: Command | undefined,
      options: IOption[] = [],
      names: string[] = [],
    ): IOption[] => {
      if (cmd) {
        if (cmd.options.length) {
          cmd.options.forEach((option: IOption) => {
            if (
              option.global &&
              !this.options.find((opt) => opt.name === option.name) &&
              names.indexOf(option.name) === -1 &&
              (hidden || !option.hidden)
            ) {
              names.push(option.name);
              options.push(option);
            }
          });
        }

        return getOptions(cmd._parent, options, names);
      }

      return options;
    };

    return getOptions(this._parent);
  }

  /**
   * Checks whether the command has an option with given name or not.
   * @param name Name of the option. Must be in param-case.
   * @param hidden Include hidden options.
   */
  public hasOption(name: string, hidden?: boolean): boolean {
    return !!this.getOption(name, hidden);
  }

  /**
   * Get option by name.
   * @param name Name of the option. Must be in param-case.
   * @param hidden Include hidden options.
   */
  public getOption(name: string, hidden?: boolean): IOption | undefined {
    return this.getBaseOption(name, hidden) ??
      this.getGlobalOption(name, hidden);
  }

  /**
   * Get base option by name.
   * @param name Name of the option. Must be in param-case.
   * @param hidden Include hidden options.
   */
  public getBaseOption(name: string, hidden?: boolean): IOption | undefined {
    const option = this.options.find((option) => option.name === name);

    return option && (hidden || !option.hidden) ? option : undefined;
  }

  /**
   * Get global option from parent command's by name.
   * @param name Name of the option. Must be in param-case.
   * @param hidden Include hidden options.
   */
  public getGlobalOption(name: string, hidden?: boolean): IOption | undefined {
    if (!this._parent) {
      return;
    }

    const option: IOption | undefined = this._parent.getBaseOption(
      name,
      hidden,
    );

    if (!option || !option.global) {
      return this._parent.getGlobalOption(name, hidden);
    }

    return option;
  }

  /**
   * Remove option by name.
   * @param name Name of the option. Must be in param-case.
   */
  public removeOption(name: string): IOption | undefined {
    const index = this.options.findIndex((option) => option.name === name);

    if (index === -1) {
      return;
    }

    return this.options.splice(index, 1)[0];
  }

  /**
   * Checks whether the command has sub-commands or not.
   * @param hidden Include hidden commands.
   */
  public hasCommands(hidden?: boolean): boolean {
    return this.getCommands(hidden).length > 0;
  }

  /**
   * Get commands.
   * @param hidden Include hidden commands.
   */
  public getCommands(hidden?: boolean): Array<Command> {
    return this.getGlobalCommands(hidden).concat(this.getBaseCommands(hidden));
  }

  /**
   * Get base commands.
   * @param hidden Include hidden commands.
   */
  public getBaseCommands(hidden?: boolean): Array<Command> {
    const commands = Array.from(this.commands.values());
    return hidden ? commands : commands.filter((cmd) => !cmd.isHidden);
  }

  /**
   * Get global commands.
   * @param hidden Include hidden commands.
   */
  public getGlobalCommands(hidden?: boolean): Array<Command> {
    const getCommands = (
      cmd: Command | undefined,
      commands: Array<Command> = [],
      names: string[] = [],
    ): Array<Command> => {
      if (cmd) {
        if (cmd.commands.size) {
          cmd.commands.forEach((cmd: Command) => {
            if (
              cmd.isGlobal &&
              this !== cmd &&
              !this.commands.has(cmd._name) &&
              names.indexOf(cmd._name) === -1 &&
              (hidden || !cmd.isHidden)
            ) {
              names.push(cmd._name);
              commands.push(cmd);
            }
          });
        }

        return getCommands(cmd._parent, commands, names);
      }

      return commands;
    };

    return getCommands(this._parent);
  }

  /**
   * Checks whether the command has a sub-command with given name or not.
   * @param name Name of the command.
   * @param hidden Include hidden commands.
   */
  public hasCommand(name: string, hidden?: boolean): boolean {
    return !!this.getCommand(name, hidden);
  }

  /**
   * Get command by name.
   * @param name Name of the command.
   * @param hidden Include hidden commands.
   */
  public getCommand(
    name: string,
    hidden?: boolean,
  ): Command | undefined {
    return this.getBaseCommand(name, hidden) ??
      this.getGlobalCommand(name, hidden);
  }

  /**
   * Get base command by name.
   * @param name Name of the command.
   * @param hidden Include hidden commands.
   */
  public getBaseCommand(
    name: string,
    hidden?: boolean,
  ): Command | undefined {
    const cmd: Command | undefined = this.commands.get(name);

    return (cmd && (hidden || !cmd.isHidden) ? cmd : undefined) as
      | Command
      | undefined;
  }

  /**
   * Get global command by name.
   * @param name Name of the command.
   * @param hidden Include hidden commands.
   */
  public getGlobalCommand(
    name: string,
    hidden?: boolean,
  ): Command | undefined {
    if (!this._parent) {
      return;
    }

    const cmd = this._parent.getBaseCommand(name, hidden);

    if (!cmd?.isGlobal) {
      return this._parent.getGlobalCommand(name, hidden);
    }

    return cmd;
  }

  /**
   * Remove sub-command by name.
   * @param name Name of the command.
   */
  public removeCommand(name: string): Command | undefined {
    const command = this.getBaseCommand(name, true);

    if (command) {
      this.commands.delete(name);
    }

    return command;
  }

  /** Get types. */
  public getTypes(): IType[] {
    return this.getGlobalTypes().concat(this.getBaseTypes());
  }

  /** Get base types. */
  public getBaseTypes(): IType[] {
    return Array.from(this.types.values());
  }

  /** Get global types. */
  public getGlobalTypes(): IType[] {
    const getTypes = (
      cmd: Command | undefined,
      types: IType[] = [],
      names: string[] = [],
    ): IType[] => {
      if (cmd) {
        if (cmd.types.size) {
          cmd.types.forEach((type: IType) => {
            if (
              type.global &&
              !this.types.has(type.name) &&
              names.indexOf(type.name) === -1
            ) {
              names.push(type.name);
              types.push(type);
            }
          });
        }

        return getTypes(cmd._parent, types, names);
      }

      return types;
    };

    return getTypes(this._parent);
  }

  /**
   * Get type by name.
   * @param name Name of the type.
   */
  protected getType(name: string): IType | undefined {
    return this.getBaseType(name) ?? this.getGlobalType(name);
  }

  /**
   * Get base type by name.
   * @param name Name of the type.
   */
  protected getBaseType(name: string): IType | undefined {
    return this.types.get(name);
  }

  /**
   * Get global type by name.
   * @param name Name of the type.
   */
  protected getGlobalType(name: string): IType | undefined {
    if (!this._parent) {
      return;
    }

    const cmd: IType | undefined = this._parent.getBaseType(name);

    if (!cmd?.global) {
      return this._parent.getGlobalType(name);
    }

    return cmd;
  }

  /** Get completions. */
  public getCompletions() {
    return this.getGlobalCompletions().concat(this.getBaseCompletions());
  }

  /** Get base completions. */
  public getBaseCompletions(): ICompletion[] {
    return Array.from(this.completions.values());
  }

  /** Get global completions. */
  public getGlobalCompletions(): ICompletion[] {
    const getCompletions = (
      cmd: Command | undefined,
      completions: ICompletion[] = [],
      names: string[] = [],
    ): ICompletion[] => {
      if (cmd) {
        if (cmd.completions.size) {
          cmd.completions.forEach((completion: ICompletion) => {
            if (
              completion.global &&
              !this.completions.has(completion.name) &&
              names.indexOf(completion.name) === -1
            ) {
              names.push(completion.name);
              completions.push(completion);
            }
          });
        }

        return getCompletions(cmd._parent, completions, names);
      }

      return completions;
    };

    return getCompletions(this._parent);
  }

  /**
   * Get completion by name.
   * @param name Name of the completion.
   */
  public getCompletion(name: string) {
    return this.getBaseCompletion(name) ?? this.getGlobalCompletion(name);
  }

  /**
   * Get base completion by name.
   * @param name Name of the completion.
   */
  public getBaseCompletion(name: string): ICompletion | undefined {
    return this.completions.get(name);
  }

  /**
   * Get global completions by name.
   * @param name Name of the completion.
   */
  public getGlobalCompletion(name: string): ICompletion | undefined {
    if (!this._parent) {
      return;
    }

    const completion: ICompletion | undefined = this._parent.getBaseCompletion(
      name,
    );

    if (!completion?.global) {
      return this._parent.getGlobalCompletion(name);
    }

    return completion;
  }

  /**
   * Checks whether the command has environment variables or not.
   * @param hidden Include hidden environment variable.
   */
  public hasEnvVars(hidden?: boolean): boolean {
    return this.getEnvVars(hidden).length > 0;
  }

  /**
   * Get environment variables.
   * @param hidden Include hidden environment variable.
   */
  public getEnvVars(hidden?: boolean): IEnvVar[] {
    return this.getGlobalEnvVars(hidden).concat(this.getBaseEnvVars(hidden));
  }

  /**
   * Get base environment variables.
   * @param hidden Include hidden environment variable.
   */
  public getBaseEnvVars(hidden?: boolean): IEnvVar[] {
    if (!this.envVars.length) {
      return [];
    }

    return hidden
      ? this.envVars.slice(0)
      : this.envVars.filter((env) => !env.hidden);
  }

  /**
   * Get global environment variables.
   * @param hidden Include hidden environment variable.
   */
  public getGlobalEnvVars(hidden?: boolean): IEnvVar[] {
    const getEnvVars = (
      cmd: Command | undefined,
      envVars: IEnvVar[] = [],
      names: string[] = [],
    ): IEnvVar[] => {
      if (cmd) {
        if (cmd.envVars.length) {
          cmd.envVars.forEach((envVar: IEnvVar) => {
            if (
              envVar.global &&
              !this.envVars.find((env) => env.names[0] === envVar.names[0]) &&
              names.indexOf(envVar.names[0]) === -1 &&
              (hidden || !envVar.hidden)
            ) {
              names.push(envVar.names[0]);
              envVars.push(envVar);
            }
          });
        }

        return getEnvVars(cmd._parent, envVars, names);
      }

      return envVars;
    };

    return getEnvVars(this._parent);
  }

  /**
   * Checks whether the command has an environment variable with given name or not.
   * @param name Name of the environment variable.
   * @param hidden Include hidden environment variable.
   */
  public hasEnvVar(name: string, hidden?: boolean): boolean {
    return !!this.getEnvVar(name, hidden);
  }

  /**
   * Get environment variable by name.
   * @param name Name of the environment variable.
   * @param hidden Include hidden environment variable.
   */
  public getEnvVar(name: string, hidden?: boolean): IEnvVar | undefined {
    return this.getBaseEnvVar(name, hidden) ??
      this.getGlobalEnvVar(name, hidden);
  }

  /**
   * Get base environment variable by name.
   * @param name Name of the environment variable.
   * @param hidden Include hidden environment variable.
   */
  public getBaseEnvVar(name: string, hidden?: boolean): IEnvVar | undefined {
    const envVar: IEnvVar | undefined = this.envVars.find((env) =>
      env.names.indexOf(name) !== -1
    );

    return envVar && (hidden || !envVar.hidden) ? envVar : undefined;
  }

  /**
   * Get global environment variable by name.
   * @param name Name of the environment variable.
   * @param hidden Include hidden environment variable.
   */
  public getGlobalEnvVar(name: string, hidden?: boolean): IEnvVar | undefined {
    if (!this._parent) {
      return;
    }

    const envVar: IEnvVar | undefined = this._parent.getBaseEnvVar(
      name,
      hidden,
    );

    if (!envVar?.global) {
      return this._parent.getGlobalEnvVar(name, hidden);
    }

    return envVar;
  }

  /** Checks whether the command has examples or not. */
  public hasExamples(): boolean {
    return this.examples.length > 0;
  }

  /** Get all examples. */
  public getExamples(): IExample[] {
    return this.examples;
  }

  /** Checks whether the command has an example with given name or not. */
  public hasExample(name: string): boolean {
    return !!this.getExample(name);
  }

  /** Get example with given name. */
  public getExample(name: string): IExample | undefined {
    return this.examples.find((example) => example.name === name);
  }
}
