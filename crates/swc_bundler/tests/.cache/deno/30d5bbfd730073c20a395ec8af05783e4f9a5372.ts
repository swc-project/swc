// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/command/lib/zsh-completions-generator.ts


import snakeCase from '../../x/snakeCase.ts';
import { Command } from './command.ts';
import { IArgumentDetails, IOption } from './types.ts';

interface ICompletionAction {
    arg: IArgumentDetails;
    label: string;
    name: string;
    cmd: string;
}

export class ZshCompletionsGenerator {

    private actions: Map<string, ICompletionAction> = new Map();

    public static generate( cmd: Command ) {
        return new ZshCompletionsGenerator( cmd ).generate();
    }

    private constructor( protected cmd: Command ) {}

    /**
     * Generates zsh completions code.
     */
    private generate(): string {

        return `
# compdef _${ snakeCase( this.cmd.getPath() ) } ${ this.cmd.getPath() }
#
# zsh completion for ${ this.cmd.getPath() }
#
# version: ${ this.cmd.getVersion() }
#

autoload -U is-at-least

(( $+functions[__${ snakeCase( this.cmd.getName() ) }_complete] )) ||
function __${ snakeCase( this.cmd.getName() ) }_complete {
    local name="$1"; shift
    local action="$1"; shift
    integer ret=1
    local -a values
    local expl
    _tags "$name"
    while _tags; do
        if _requested "$name"; then
            values=( \$( ${ this.cmd.getName() } completions complete $action $@) )
            if (( \${#values[@]} )); then
                while _next_label "$name" expl "$action"; do
                    compadd -S '' "\$expl[@]" $values[@]
                done
            fi
        fi
    done
}

${ this.generateCompletions( this.cmd ).trim() }

# _${ snakeCase( this.cmd.getPath() ) } "\${@}"

compdef _${ snakeCase( this.cmd.getPath() ) } ${ this.cmd.getPath() }

#
# Local Variables:
# mode: Shell-Script
# sh-indentation: 4
# indent-tabs-mode: nil
# sh-basic-offset: 4
# End:
# vim: ft=zsh sw=4 ts=4 et
`.trim();
    }

    /**
     * Generates zsh completions method for given command and child commands.
     */
    private generateCompletions( command: Command, path: string = '' ): string {

        if ( !command.hasCommands( false ) && !command.hasOptions( false ) && !command.hasArguments() ) {
            return '';
        }

        path = ( path ? path + ' ' : '' ) + command.getName();

        return `(( $+functions[_${ snakeCase( path ) }] )) ||
function _${ snakeCase( path ) }() {`
            + ( !command.getParent() ? `\n\n    local context state state_descr line\n    typeset -A opt_args` : '' )
            + this.generateCommandCompletions( command, path )
            + this.generateSubCommandCompletions( command, path )
            + this.generateArgumentCompletions( command, path )
            + this.generateActions( command )
            + `\n}\n\n`
            + command.getCommands( false )
                .filter( ( subCommand: Command ) => subCommand !== command )
                .map( ( subCommand: Command ) => this.generateCompletions( subCommand, path ) )
                .join( '' );
    }

    private generateCommandCompletions( command: Command, path: string ): string {

        const commands = command.getCommands( false );

        let completions: string = commands
            .map( ( subCommand: Command ) =>
                `'${ subCommand.getName() }:${ subCommand.getShortDescription() }'` )
            .join( '\n            ' );

        if ( completions ) {
            completions = `
        local -a commands
        commands=(
            ${ completions }
        )
        _describe 'command' commands`;
        }

        if ( command.hasArguments() ) {

            const completionsPath: string = path.split( ' ' ).slice( 1 ).join( ' ' );

            const arg: IArgumentDetails = command.getArguments()[ 0 ];

            const action = this.addAction( arg, completionsPath );

            if ( action ) {
                completions += `\n        __${ snakeCase( this.cmd.getName() ) }_complete ${ action.arg.name } ${ action.arg.action } ${ action.cmd }`;
            }
        }

        if ( completions ) {
            completions = `\n\n    function _commands() {${ completions }\n    }`;
        }

        return completions;
    }

    private generateSubCommandCompletions( command: Command, path: string ): string {

        if ( command.hasCommands( false ) ) {

            const actions: string = command
                .getCommands( false )
                .map( ( command: Command ) => `${ command.getName() }) _${ snakeCase( path + ' ' + command.getName() ) } ;;` )
                .join( '\n            ' );

            return `\n
    function _command_args() {
        case "$words[1]" in\n            ${ actions }\n        esac
    }`;
        }

        return '';
    }

    private generateArgumentCompletions( command: Command, path: string ): string {

        /* clear actions from previously parsed command. */
        this.actions.clear();

        const options: string[] = this.generateOptions( command, path );

        let argIndex = 0;
        // @TODO: add stop early option: -A "-*"
        // http://zsh.sourceforge.net/Doc/Release/Completion-System.html
        let argsCommand = '\n\n    _arguments -w -s -S -C';

        if ( command.hasOptions() ) {
            argsCommand += ` \\\n        ${ options.join( ' \\\n        ' ) }`;
        }

        if ( command.hasCommands( false ) || command.hasArguments() ) {
            argsCommand += ` \\\n        '${ ++argIndex }: :_commands'`;
        }

        if ( command.hasArguments() || command.hasCommands( false ) ) {

            const args: string[] = [];

            for ( const arg of command.getArguments().slice( 1 ) ) {

                const completionsPath: string = path.split( ' ' ).slice( 1 ).join( ' ' );

                const action = this.addAction( arg, completionsPath );

                args.push( `${ ++argIndex }${ arg.optionalValue ? '::' : ':' }${ action.name }` );
            }

            argsCommand += args.map( ( arg: string ) => `\\\n        '${ arg }'` ).join( '' );

            if ( command.hasCommands( false ) ) {
                argsCommand += ` \\\n        '*:: :->command_args'`;
            }
        }

        return argsCommand;
    }

    private generateOptions( command: Command, path: string ) {

        const options: string[] = [];
        const cmdArgs: string[] = path.split( ' ' );
        const baseName: string = cmdArgs.shift() as string;
        const completionsPath: string = cmdArgs.join( ' ' );

        const excludedFlags: string[] = command.getOptions( false )
            .map( option => option.standalone ? option.flags.split( /[, ] */g ) : false )
            .flat()
            .filter( flag => typeof flag === 'string' ) as string[];

        for ( const option of command.getOptions( false ) ) {
            options.push( this.generateOption( option, completionsPath, excludedFlags ) );
        }

        return options;
    }

    private generateOption( option: IOption, completionsPath: string, excludedOptions: string[] ): string {

        let excludedFlags = option.conflicts?.length ? [ ...excludedOptions, ...option.conflicts ] : excludedOptions;
        excludedFlags = option.collect ? excludedFlags : [
            ...excludedFlags,
            ...option.flags.split( /[, ] */g )
        ];

        let args: string = '';
        for ( const arg of option.args ) {

            const action = this.addAction( arg, completionsPath );

            if ( arg.variadic ) {
                args += `${ arg.optionalValue ? '::' : ':' }${ arg.name }:->${ action.name }`;
            } else {
                args += `${ arg.optionalValue ? '::' : ':' }${ arg.name }:->${ action.name }`;
            }
        }

        const description: string | undefined = option.description.trim().split( '\n' ).shift();
        const collect: string = option.collect ? '*' : '';
        const flags: string = option.flags.replace( / +/g, '' );

        if ( option.standalone ) {
            return `'(- *)'{${ collect }${ flags }}'[${ description }]${ args }'`;
        } else {
            const excluded: string = excludedFlags.length ? `'(${ excludedFlags.join( ' ' ) })'` : '';
            return `${ excluded }{${ collect }${ flags }}'[${ description }]${ args }'`;
        }
    }

    private addAction( arg: IArgumentDetails, cmd: string ): ICompletionAction {

        const action = `${ arg.name }-${ arg.action }`;

        if ( !this.actions.has( action ) ) {
            this.actions.set( action, {
                arg: arg,
                label: `${ arg.name }: ${ arg.action }`,
                name: action,
                cmd
            } );
        }

        return this.actions.get( action ) as ICompletionAction;
    }

    private generateActions( command: Command ): string {

        let actions: string[] = [];

        if ( this.actions.size ) {

            actions = Array
                .from( this.actions )
                .map( ( [ name, action ] ) =>
                    `${ name }) __${ snakeCase( this.cmd.getName() ) }_complete ${ action.arg.name } ${ action.arg.action } ${ action.cmd } ;;` );
        }

        if ( command.hasCommands( false ) ) {
            actions.unshift( `command_args) _command_args ;;` );
        }

        if ( actions.length ) {
            return `\n\n    case "$state" in\n        ${ actions.join( '\n        ' ) }\n    esac`;
        }

        return '';
    }
}
