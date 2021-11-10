// Loaded from https://deno.land/x/cliffy@v0.18.0/command/completions/_bash_completions_generator.ts


import type { Command } from "../command.ts";
import type { IArgument } from "../types.ts";

/** Generates bash completions script. */
export class BashCompletionsGenerator {
  /** Generates bash completions script for given command. */
  public static generate(cmd: Command) {
    return new BashCompletionsGenerator(cmd).generate();
  }

  private constructor(protected cmd: Command) {}

  /** Generates bash completions code. */
  private generate(): string {
    const path = this.cmd.getPath();
    const version: string | undefined = this.cmd.getVersion()
      ? ` v${this.cmd.getVersion()}`
      : "";

    return `#!/usr/bin/env bash
# bash completion support for ${path}${version}

_${replaceSpecialChars(path)}() {
  local word cur prev
  local -a opts
  COMPREPLY=()
  cur="\${COMP_WORDS[COMP_CWORD]}"
  prev="\${COMP_WORDS[COMP_CWORD-1]}"
  cmd="_"
  opts=()
  
  _${replaceSpecialChars(this.cmd.getName())}_complete() {
    local action="$1"; shift
    mapfile -t values < <( ${this.cmd.getName()} completions complete "\${action}" "\${@}" )
    for i in "\${values[@]}"; do
      opts+=("$i")
    done
  }

  ${this.generateCompletions(this.cmd).trim()}
  
  for word in "\${COMP_WORDS[@]}"; do
    case "\${word}" in
      -*) ;;
      *) 
        cmd_tmp="\${cmd}_\${word//[^[:alnum:]]/_}"
        if type "\${cmd_tmp}" &>/dev/null; then
          cmd="\${cmd_tmp}"
        fi
    esac
  done
  
  \${cmd}

  if [[ \${#opts[@]} -eq 0 ]]; then
    # shellcheck disable=SC2207
    COMPREPLY=($(compgen -f "\${cur}"))
    return 0
  fi

  local values
  values="$( printf "\\n%s" "\${opts[@]}" )"
  local IFS=$'\\n'
  # shellcheck disable=SC2207
  local result=($(compgen -W "\${values[@]}" -- "\${cur}"))
  if [[ \${#result[@]} -eq 0 ]]; then
    # shellcheck disable=SC2207
    COMPREPLY=($(compgen -f "\${cur}"))
  else
    # shellcheck disable=SC2207
    COMPREPLY=($(printf '%q\\n' "\${result[@]}"))
  fi
  
  return 0
}

complete -F _${replaceSpecialChars(path)} -o bashdefault -o default ${path}
`;
  }

  /** Generates bash completions method for given command and child commands. */
  private generateCompletions(command: Command, path = "", index = 1): string {
    path = (path ? path + " " : "") + command.getName();
    const commandCompletions = this.generateCommandCompletions(
      command,
      path,
      index,
    );
    const childCommandCompletions: string = command.getCommands(false)
      .filter((subCommand: Command) => subCommand !== command)
      .map((subCommand: Command) =>
        this.generateCompletions(subCommand, path, index + 1)
      )
      .join("");

    return `${commandCompletions}

${childCommandCompletions}`;
  }

  private generateCommandCompletions(
    command: Command,
    path: string,
    index: number,
  ): string {
    const flags: string[] = this.getFlags(command);

    const childCommandNames: string[] = command.getCommands(false)
      .map((childCommand: Command) => childCommand.getName());

    const completionsPath: string = ~path.indexOf(" ")
      ? " " + path.split(" ").slice(1).join(" ")
      : "";

    const optionArguments = this.generateOptionArguments(
      command,
      completionsPath,
    );

    const completionsCmd: string = this.generateCommandCompletionsCommand(
      command.getArguments(),
      completionsPath,
    );

    return `  __${replaceSpecialChars(path)}() {
    opts=(${[...flags, ...childCommandNames].join(" ")})
    ${completionsCmd}
    if [[ \${cur} == -* || \${COMP_CWORD} -eq ${index} ]] ; then
      return 0
    fi
    ${optionArguments}
  }`;
  }

  private getFlags(command: Command): string[] {
    return command.getOptions(false)
      .map((option) => option.flags)
      .flat();
  }

  private generateOptionArguments(
    command: Command,
    completionsPath: string,
  ): string {
    let opts = "";
    const options = command.getOptions(false);
    if (options.length) {
      opts += 'case "${prev}" in';
      for (const option of options) {
        const flags: string = option.flags
          .map((flag) => flag.trim())
          .join("|");

        const completionsCmd: string = this.generateOptionCompletionsCommand(
          option.args,
          completionsPath,
          { standalone: option.standalone },
        );

        opts += `\n      ${flags}) ${completionsCmd} ;;`;
      }
      opts += "\n    esac";
    }

    return opts;
  }

  private generateCommandCompletionsCommand(
    args: IArgument[],
    path: string,
  ) {
    if (args.length) {
      // @TODO: add support for multiple arguments
      return `_${replaceSpecialChars(this.cmd.getName())}_complete ${
        args[0].action
      }${path}`;
    }

    return "";
  }

  private generateOptionCompletionsCommand(
    args: IArgument[],
    path: string,
    opts?: { standalone?: boolean },
  ) {
    if (args.length) {
      // @TODO: add support for multiple arguments
      return `opts=(); _${replaceSpecialChars(this.cmd.getName())}_complete ${
        args[0].action
      }${path}`;
    }

    if (opts?.standalone) {
      return "opts=()";
    }

    return "";
  }
}

function replaceSpecialChars(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, "_");
}
