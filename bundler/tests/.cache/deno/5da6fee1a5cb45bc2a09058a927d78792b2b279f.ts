// Loaded from https://deno.land/x/cliffy@v0.18.0/command/help/_help_generator.ts


import { getFlag } from "../../flags/_utils.ts";
import { Table } from "../../table/table.ts";
import { parseArgumentsDefinition } from "../_utils.ts";
import type { Command } from "../command.ts";
import {
  blue,
  bold,
  dim,
  green,
  italic,
  magenta,
  red,
  yellow,
} from "../deps.ts";
import type { IArgument } from "../types.ts";
import type { IEnvVar, IExample, IOption } from "../types.ts";

export interface HelpOptions {
  types?: boolean;
  hints?: boolean;
}

/** Help text generator. */
export class HelpGenerator {
  private indent = 2;
  private options: HelpOptions;

  /** Generate help text for given command. */
  public static generate(cmd: Command, options?: HelpOptions): string {
    return new HelpGenerator(cmd, options).generate();
  }

  private constructor(private cmd: Command, options: HelpOptions = {}) {
    this.options = {
      types: false,
      hints: true,
      ...options,
    };
  }

  private generate(): string {
    return this.generateHeader() +
      this.generateDescription() +
      this.generateOptions() +
      this.generateCommands() +
      this.generateEnvironmentVariables() +
      this.generateExamples() +
      "\n";
  }

  private generateHeader(): string {
    const rows = [
      [
        bold("Usage:"),
        magenta(
          `${this.cmd.getPath()}${
            this.cmd.getArgsDefinition()
              ? " " + this.cmd.getArgsDefinition()
              : ""
          }`,
        ),
      ],
    ];
    const version: string | undefined = this.cmd.getVersion();
    if (version) {
      rows.push([bold("Version:"), yellow(`v${this.cmd.getVersion()}`)]);
    }
    return "\n" +
      Table.from(rows)
        .indent(this.indent)
        .padding(1)
        .toString() +
      "\n";
  }

  private generateDescription(): string {
    if (!this.cmd.getDescription()) {
      return "";
    }
    return this.label("Description") +
      Table.from([
        [this.cmd.getDescription()],
      ])
        .indent(this.indent * 2)
        .maxColWidth(140)
        .padding(1)
        .toString() +
      "\n";
  }

  private generateOptions(): string {
    const options = this.cmd.getOptions(false);
    if (!options.length) {
      return "";
    }

    const hasTypeDefinitions = !!options.find((option) =>
      !!option.typeDefinition
    );

    if (hasTypeDefinitions) {
      return this.label("Options") +
        Table.from([
          ...options.map((option: IOption) => [
            option.flags.map((flag) => blue(flag)).join(", "),
            highlightArguments(
              option.typeDefinition || "",
              this.options.types,
            ),
            red(bold("-")) + " " +
            option.description.split("\n").shift() as string,
            this.generateHints(option),
          ]),
        ])
          .padding([2, 2, 2])
          .indent(this.indent * 2)
          .maxColWidth([60, 60, 80, 60])
          .toString() +
        "\n";
    }

    return this.label("Options") +
      Table.from([
        ...options.map((option: IOption) => [
          option.flags.map((flag) => blue(flag)).join(", "),
          red(bold("-")) + " " +
          option.description.split("\n").shift() as string,
          this.generateHints(option),
        ]),
      ])
        .padding([2, 2])
        .indent(this.indent * 2)
        .maxColWidth([60, 80, 60])
        .toString() +
      "\n";
  }

  private generateCommands(): string {
    const commands = this.cmd.getCommands(false);
    if (!commands.length) {
      return "";
    }

    const hasTypeDefinitions = !!commands.find((command) =>
      !!command.getArgsDefinition()
    );

    if (hasTypeDefinitions) {
      return this.label("Commands") +
        Table.from([
          ...commands.map((command: Command) => [
            [command.getName(), ...command.getAliases()].map((name) =>
              blue(name)
            ).join(", "),
            highlightArguments(
              command.getArgsDefinition() || "",
              this.options.types,
            ),
            red(bold("-")) + " " +
            command.getDescription().split("\n").shift() as string,
          ]),
        ])
          .padding([2, 2, 2])
          .indent(this.indent * 2)
          .toString() +
        "\n";
    }

    return this.label("Commands") +
      Table.from([
        ...commands.map((command: Command) => [
          [command.getName(), ...command.getAliases()].map((name) => blue(name))
            .join(", "),
          red(bold("-")) + " " +
          command.getDescription().split("\n").shift() as string,
        ]),
      ])
        .padding([2, 2])
        .indent(this.indent * 2)
        .toString() +
      "\n";
  }

  private generateEnvironmentVariables(): string {
    const envVars = this.cmd.getEnvVars(false);
    if (!envVars.length) {
      return "";
    }
    return this.label("Environment variables") +
      Table.from([
        ...envVars.map((envVar: IEnvVar) => [
          envVar.names.map((name: string) => blue(name)).join(", "),
          highlightArgumentDetails(
            envVar.details,
            this.options.types,
          ),
          `${red(bold("-"))} ${envVar.description}`,
        ]),
      ])
        .padding(2)
        .indent(this.indent * 2)
        .toString() +
      "\n";
  }

  private generateExamples(): string {
    const examples = this.cmd.getExamples();
    if (!examples.length) {
      return "";
    }
    return this.label("Examples") +
      Table.from(examples.map((example: IExample) => [
        dim(bold(`${capitalize(example.name)}:`)),
        example.description,
      ]))
        .padding(1)
        .indent(this.indent * 2)
        .maxColWidth(150)
        .toString() +
      "\n";
  }

  private generateHints(option: IOption): string {
    if (!this.options.hints) {
      return "";
    }
    const hints = [];

    option.required && hints.push(yellow(`required`));
    typeof option.default !== "undefined" && hints.push(
      bold(`Default: `) + inspect(option.default),
    );
    option.depends?.length && hints.push(
      yellow(bold(`Depends: `)) +
        italic(option.depends.map(getFlag).join(", ")),
    );
    option.conflicts?.length && hints.push(
      red(bold(`Conflicts: `)) +
        italic(option.conflicts.map(getFlag).join(", ")),
    );

    if (hints.length) {
      return `(${hints.join(", ")})`;
    }

    return "";
  }

  private label(label: string) {
    return "\n" +
      " ".repeat(this.indent) + bold(`${label}:`) +
      "\n\n";
  }
}

function capitalize(string: string): string {
  return string?.charAt(0).toUpperCase() + string.slice(1) ?? "";
}

function inspect(value: unknown): string {
  return Deno.inspect(
    value,
    // deno < 1.4.3 doesn't support the colors property.
    { depth: 1, colors: true, trailingComma: false } as Deno.InspectOptions,
  );
}

/**
 * Colorize arguments string.
 * @param argsDefinition Arguments definition: `<color1:string> <color2:string>`
 * @param types Show types.
 */
function highlightArguments(argsDefinition: string, types = true) {
  if (!argsDefinition) {
    return "";
  }

  return parseArgumentsDefinition(argsDefinition)
    .map((arg: IArgument) => highlightArgumentDetails(arg, types)).join(" ");
}

/**
 * Colorize argument string.
 * @param arg Argument details.
 * @param types Show types.
 */
function highlightArgumentDetails(
  arg: IArgument,
  types = true,
): string {
  let str = "";

  str += yellow(arg.optionalValue ? "[" : "<");

  let name = "";
  name += arg.name;
  if (arg.variadic) {
    name += "...";
  }
  name = magenta(name);

  str += name;

  if (types) {
    str += yellow(":");
    str += red(arg.type);
  }

  if (arg.list) {
    str += green("[]");
  }

  str += yellow(arg.optionalValue ? "]" : ">");

  return str;
}
