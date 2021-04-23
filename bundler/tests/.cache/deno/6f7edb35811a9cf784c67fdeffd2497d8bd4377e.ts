// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/command/lib/command.ts


const { stdout, stderr } = Deno;
import { encode } from 'https://deno.land/std@0.63.0/encoding/utf8.ts';
import { dim, red } from 'https://deno.land/std@0.63.0/fmt/colors.ts';
import { parseFlags } from '../../flags/lib/flags.ts';
import { IFlagArgument, IFlagOptions, IFlagsResult, IFlagValue, IFlagValueHandler, IFlagValueType, ITypeHandler } from '../../flags/lib/types.ts';
import { fill } from '../../flags/lib/utils.ts';
import format from '../../x/format.ts';
import { BooleanType } from '../types/boolean.ts';
import { NumberType } from '../types/number.ts';
import { StringType } from '../types/string.ts';
import { Type } from '../types/type.ts';
import { ArgumentsParser } from './arguments-parser.ts';
import { HelpGenerator } from './help-generator.ts';
import { IAction, IArgumentDetails, ICommandOption, ICompleteHandler, ICompleteOptions, ICompleteSettings, IDescription, IEnvVariable, IEnvVarOption, IExample, IOption, IParseResult, ITypeMap, ITypeOption, ITypeSettings } from './types.ts';

const permissions: any = ( Deno as any ).permissions;
const envPermissionStatus: any = permissions && permissions.query && await permissions.query( { name: 'env' } );
const hasEnvPermissions: boolean = !!envPermissionStatus && envPermissionStatus.state === 'granted';

interface IDefaultOption<O = any, A extends Array<any> = any> {
    flags: string;
    desc?: string
    opts?: ICommandOption<O, A>;
}

/**
 * Base command implementation without pre configured command's and option's.
 */
export class Command<O = any, A extends Array<any> = any> {

    private types: ITypeMap = new Map<string, ITypeSettings>( [
        [ 'string', { name: 'string', handler: new StringType() } ],
        [ 'number', { name: 'number', handler: new NumberType() } ],
        [ 'boolean', { name: 'boolean', handler: new BooleanType() } ]
    ] );
    private rawArgs: string[] = [];
    private literalArgs: string[] = [];
    // @TODO: get script name: https://github.com/denoland/deno/pull/5034
    // private name: string = location.pathname.split( '/' ).pop() as string;
    private _name: string = 'COMMAND';
    private _parent?: Command;
    private _globalParent?: Command;
    private ver: string = '0.0.0';
    private desc: IDescription = '';
    private fn?: IAction<O, A>;
    private options: IOption<O, A>[] = [];
    private commands: Map<string, Command> = new Map();
    private examples: IExample[] = [];
    private envVars: IEnvVariable[] = [];
    private aliases: string[] = [];
    private completions: Map<string, ICompleteSettings> = new Map();
    private cmd: Command = this;
    private argsDefinition?: string;
    private isExecutable: boolean = false;
    private throwOnError: boolean = false;
    private _allowEmpty: boolean = true;
    private _stopEarly: boolean = false;
    private defaultCommand?: string;
    private _useRawArgs: boolean = false;
    private args: IArgumentDetails[] = [];
    private isHidden: boolean = false;
    private isGlobal: boolean = false;
    private hasDefaults: Boolean = false;
    private _versionOption?: IDefaultOption<O, A> | false;
    private _helpOption?: IDefaultOption<O, A> | false;

    public versionOption( flags: string | false, desc?: string, opts?: IAction<O, A> | ICommandOption<O, A> ): this {
        this._versionOption = flags === false ? flags : {
            flags,
            desc,
            opts: typeof opts === 'function' ? { action: opts } : opts
        };
        return this;
    }

    public helpOption( flags: string | false, desc?: string, opts?: IAction<O, A> | ICommandOption<O, A> ): this {
        this._helpOption = flags === false ? flags : {
            flags,
            desc,
            opts: typeof opts === 'function' ? { action: opts } : opts
        };
        return this;
    }

    /**
     * Add new sub-command.
     */
    public command( nameAndArguments: string, cmd?: Command | string, override?: boolean ): this {

        let executableDescription: string | undefined;

        if ( typeof cmd === 'string' ) {
            executableDescription = cmd;
            cmd = undefined;
        }

        const result = ArgumentsParser.splitArguments( nameAndArguments );

        const name: string | undefined = result.args.shift();
        const aliases: string[] = result.args;

        if ( !name ) {
            throw this.error( new Error( 'Missing command name.' ) );
        }

        if ( this.getBaseCommand( name, true ) ) {
            if ( !override ) {
                throw this.error( new Error( `Duplicate command: ${ name }` ) );
            }
            this.removeCommand( name );
        }

        const subCommand = ( cmd || new Command() ).reset();

        subCommand._name = name;
        subCommand._parent = this;

        if ( executableDescription ) {
            subCommand.isExecutable = true;
            subCommand.description( executableDescription );
        }

        if ( result.typeDefinition ) {
            subCommand.arguments( result.typeDefinition );
        }

        // if ( name === '*' && !subCommand.isExecutable ) {
        //     subCommand.isExecutable = true;
        // }

        aliases.forEach( alias => subCommand.aliases.push( alias ) );

        this.commands.set( name, subCommand );

        this.select( name );

        return this;
    }

    // public static async exists( name: string ) {
    //
    //     const proc = Deno.run( {
    //         cmd: [ 'sh', '-c', 'compgen -c' ],
    //         stdout: 'piped',
    //         stderr: 'piped'
    //     } );
    //     const output: Uint8Array = await proc.output();
    //     const commands = new TextDecoder().decode( output )
    //                                       .trim()
    //                                       .split( '\n' );
    //
    //     return commands.indexOf( name ) !== -1;
    // }

    /**
     * Add new command alias.
     *
     * @param alias Alias name
     */
    public alias( alias: string ): this {

        if ( this.cmd === this ) {
            throw this.error( new Error( `Failed to add alias '${ alias }'. No sub command selected.` ) );
        }

        if ( this.cmd.aliases.indexOf( alias ) !== -1 ) {
            throw this.error( new Error( `Duplicate alias: ${ alias }` ) );
        }

        this.cmd.aliases.push( alias );

        return this;
    }

    /**
     * Reset internal command reference to main command.
     */
    public reset(): this {
        return this.cmd = this;
    }

    /**
     * Reset internal command reference to child command with given name.
     *
     * @param name Sub-command name.
     */
    public select( name: string ): this {

        const cmd = this.getBaseCommand( name, true );

        if ( !cmd ) {
            throw this.error( new Error( `Sub-command not found: ${ name }` ) );
        }

        this.cmd = cmd;

        return this;
    }

    /********************************************************************************
     **** SUB HANDLER ***************************************************************
     ********************************************************************************/

    /**
     * Get or set command name.
     */
    public name( name: string ): this {
        this.cmd._name = name;
        return this;
    }

    /**
     * Set command version.
     *
     * @param version Semantic version string.
     */
    public version( version: string ): this {
        this.cmd.ver = version;
        return this;
    }

    /**
     * Set command description.
     *
     * @param description Short command description.
     */
    public description( description: IDescription ): this {
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

    /**
     * Make command globally available.
     */
    public global(): this {
        this.cmd.isGlobal = true;
        return this;
    }

    /**
     * Set command arguments.
     *
     * @param args Define required and optional commands like: <requiredArg:string> [optionalArg: number] [...restArgs:string]
     */
    public arguments( args: string ): this {
        this.cmd.argsDefinition = args;
        return this;
    }

    /**
     * Set command handler.
     *
     * @param fn Callback method.
     */
    public action( fn: IAction<O, A> ): this {
        this.cmd.fn = fn;
        return this;
    }

    /**
     * Don't throw an error if the command was called without arguments.
     *
     * @param allowEmpty
     */
    public allowEmpty( allowEmpty: boolean = true ): this {
        this.cmd._allowEmpty = allowEmpty;
        return this;
    }

    /**
     * If enabled, all arguments starting from the first non option argument will be interpreted as raw argument.
     *
     * For example:
     *     `command --debug-level warning server --port 80`
     *
     * Will result in:
     *     - options: `{debugLevel: 'warning'}`
     *     - args: `['server', '--port', '80']`
     *
     * @param stopEarly
     */
    public stopEarly( stopEarly: boolean = true ): this {
        this.cmd._stopEarly = stopEarly;
        return this;
    }

    /**
     * Disable parsing arguments. If enabled the raw arguments will be passed to the action handler.
     * This has no effect for parent or child commands. Only for the command on which this method was called.
     */
    public useRawArgs( useRawArgs: boolean = true ): this {
        this.cmd._useRawArgs = useRawArgs;
        return this;
    }

    /**
     * Set default command. The default command will be called if no action handler is registered.
     */
    public default( name: string ): this {
        this.cmd.defaultCommand = name;
        return this;
    }

    /**
     * Register command specific custom type.
     */
    public type( name: string, handler: Type<any> | ITypeHandler<any>, options?: ITypeOption ): this {

        if ( this.cmd.types.get( name ) && !options?.override ) {
            throw this.error( new Error( `Type '${ name }' already exists.` ) );
        }

        this.cmd.types.set( name, { ...options, name, handler } );

        if ( handler instanceof Type && typeof handler.complete !== 'undefined' ) {
            this.complete( name, ( cmd: Command, parent?: Command ) => handler.complete?.( cmd, parent ) || [], options );
        }

        return this;
    }

    /**
     * Register command specific custom type.
     */
    public complete( name: string, complete: ICompleteHandler, options?: ICompleteOptions ): this {

        if ( this.cmd.completions.has( name ) && !options?.override ) {
            throw this.error( new Error( `Completion '${ name }' already exists.` ) );
        }

        this.cmd.completions.set( name, {
            name,
            complete,
            ...options
        } );

        return this;
    }

    /**
     * Throw error's instead of calling `Deno.exit()` to handle error's manually.
     * This has no effect for parent commands. Only for the command on which this method was called and all child commands.
     */
    public throwErrors(): this {
        this.cmd.throwOnError = true;
        return this;
    }

    protected shouldThrowErrors(): boolean {
        return this.cmd.throwOnError || !!this.cmd._parent?.shouldThrowErrors();
    }

    public getCompletions() {
        return this.getGlobalCompletions().concat( this.getBaseCompletions() );
    }

    public getBaseCompletions(): ICompleteSettings[] {
        return Array.from( this.completions.values() );
    }

    public getGlobalCompletions(): ICompleteSettings[] {

        const getCompletions = ( cmd: Command | undefined, completions: ICompleteSettings[] = [], names: string[] = [] ): ICompleteSettings[] => {

            if ( cmd ) {
                if ( cmd.completions.size ) {
                    cmd.completions.forEach( ( completion: ICompleteSettings ) => {
                        if (
                            completion.global &&
                            !this.completions.has( completion.name ) &&
                            names.indexOf( completion.name ) === -1
                        ) {
                            names.push( completion.name );
                            completions.push( completion );
                        }
                    } );
                }

                return getCompletions( cmd._parent, completions, names );
            }

            return completions;
        };

        return getCompletions( this._parent );
    }

    public getCompletion( name: string ) {

        return this.getBaseCompletion( name ) ?? this.getGlobalCompletion( name );
    }

    public getBaseCompletion( name: string ): ICompleteSettings | undefined {

        return this.completions.get( name );
    }

    public getGlobalCompletion( name: string ): ICompleteSettings | undefined {

        if ( !this._parent ) {
            return;
        }

        let completion: ICompleteSettings | undefined = this._parent.getBaseCompletion( name );

        if ( !completion?.global ) {
            return this._parent.getGlobalCompletion( name );
        }

        return completion;
    }

    /**
     * Add new option (flag).
     *
     * @param flags Flags string like: -h, --help, --manual <requiredArg:string> [optionalArg: number] [...restArgs:string]
     * @param desc Flag description.
     * @param opts Flag options or custom handler for processing flag value.
     */
    public option( flags: string, desc: string, opts?: ICommandOption | IFlagValueHandler ): this {

        if ( typeof opts === 'function' ) {
            return this.option( flags, desc, { value: opts } );
        }

        const result = ArgumentsParser.splitArguments( flags );

        const args: IArgumentDetails[] = result.typeDefinition ? ArgumentsParser.parseArgumentsDefinition( result.typeDefinition ) : [];

        const option: IOption = {
            name: '',
            description: desc,
            args,
            flags: result.args.join( ', ' ),
            typeDefinition: result.typeDefinition,
            ...opts
        };

        if ( option.separator ) {
            for ( const arg of args ) {
                if ( arg.list ) {
                    arg.separator = option.separator;
                }
            }
        }

        for ( const part of result.args ) {

            const arg = part.trim();
            const isLong = /^--/.test( arg );

            const name = isLong ? arg.slice( 2 ) : arg.slice( 1 );

            if ( option.name === name || option.aliases && ~option.aliases.indexOf( name ) ) {
                throw this.error( new Error( `Duplicate command name: ${ name }` ) );
            }

            if ( !option.name && isLong ) {
                option.name = name;
            } else if ( !option.aliases ) {
                option.aliases = [ name ];
            } else {
                option.aliases.push( name );
            }

            if ( this.cmd.getBaseOption( name, true ) ) {
                if ( opts?.override ) {
                    this.removeOption( name );
                } else {
                    throw this.error( new Error( `Duplicate option name: ${ name }` ) );
                }
            }
        }

        if ( option.prepend ) {
            this.cmd.options.unshift( option );
        } else {
            this.cmd.options.push( option );
        }

        return this;
    }

    /**
     * Add new command example.
     *
     * @param name          Name of the example.
     * @param description   The content of the example.
     */
    public example( name: string, description: string ): this {

        if ( this.cmd.hasExample( name ) ) {
            throw this.error( new Error( 'Example already exists.' ) );
        }

        this.cmd.examples.push( { name, description } );

        return this;
    }

    /**
     * Add new environment variable.
     *
     * @param name          Name of the environment variable.
     * @param description   The description of the environment variable.
     * @param options       Environment variable options.
     */
    public env( name: string, description: string, options?: IEnvVarOption ): this {

        const result = ArgumentsParser.splitArguments( name );

        if ( !result.typeDefinition ) {
            result.typeDefinition = '<value:boolean>';
        }

        if ( result.args.some( envName => this.cmd.getBaseEnvVar( envName, true ) ) ) {
            throw this.error( new Error( `Environment variable already exists: ${ name }` ) );
        }

        const details: IArgumentDetails[] = ArgumentsParser.parseArgumentsDefinition( result.typeDefinition );

        if ( details.length > 1 ) {
            throw this.error( new Error( `An environment variable can only have one value but got: ${ name }` ) );
        } else if ( details.length && details[ 0 ].optionalValue ) {
            throw this.error( new Error( `An environment variable can not have an optional value but '${ name }' is defined as optional.` ) );
        } else if ( details.length && details[ 0 ].variadic ) {
            throw this.error( new Error( `An environment variable can not have an variadic value but '${ name }' is defined as variadic.` ) );
        }

        this.cmd.envVars.push( {
            names: result.args,
            description,
            type: details[ 0 ].type,
            details: details.shift() as IArgumentDetails,
            ...options
        } );

        return this;
    }

    /********************************************************************************
     **** MAIN HANDLER **************************************************************
     ********************************************************************************/

    /**
     * Parse command line arguments and execute matched command.
     *
     * @param args Command line args to parse. Ex: `cmd.parse( Deno.args )`
     * @param dry Execute command after parsed.
     */
    public async parse( args: string[] = Deno.args, dry?: boolean ): Promise<IParseResult<O, A>> {

        this.reset()
            .registerDefaults();

        this.rawArgs = args;

        const subCommand = this.rawArgs.length > 0 && this.getCommand( this.rawArgs[ 0 ], true );

        if ( subCommand ) {
            subCommand._globalParent = this;
            return await subCommand.parse( this.rawArgs.slice( 1 ), dry );
        }

        if ( this.isExecutable ) {

            if ( !dry ) {
                await this.executeExecutable( this.rawArgs );
            }

            return { options: {} as O, args: this.rawArgs as any as A, cmd: this, literal: this.literalArgs };

        } else if ( this._useRawArgs ) {

            if ( dry ) {
                return { options: {} as O, args: this.rawArgs as any as A, cmd: this, literal: this.literalArgs };
            }

            return await this.execute( {} as O, ...this.rawArgs as A );

        } else {

            const { flags, unknown, literal } = this.parseFlags( this.rawArgs );

            this.literalArgs = literal;

            const params = this.parseArguments( unknown, flags );

            this.validateEnvVars();

            if ( dry ) {
                return { options: flags, args: params as any as A, cmd: this, literal: this.literalArgs };
            }

            return await this.execute( flags, ...params );
        }
    }

    private registerDefaults(): this {

        if ( this.getParent() || this.hasDefaults ) {
            return this;
        }
        this.hasDefaults = true;

        this.reset();

        if ( this._versionOption !== false ) {
            this.option(
                this._versionOption?.flags || '-V, --version',
                this._versionOption?.desc || 'Show the version number for this program.',
                Object.assign( {
                    standalone: true,
                    prepend: true,
                    action: async function ( this: Command ) {
                        await Deno.stdout.writeSync( encode( this.getVersion() + '\n' ) );
                        Deno.exit( 0 );
                    }
                }, this._versionOption?.opts ?? {} ) );
        }

        if ( this._helpOption !== false ) {
            this.option(
                this._helpOption?.flags || '-h, --help',
                this._helpOption?.desc || 'Show this help.',
                Object.assign( {
                    standalone: true,
                    global: true,
                    prepend: true,
                    action: function ( this: Command ) {
                        this.help();
                        Deno.exit( 0 );
                    }
                }, this._helpOption?.opts ?? {} ) );
        }

        return this;
    };

    /**
     * Execute command.
     *
     * @param options A map of options.
     * @param args Command arguments.
     */
    protected async execute( options: O, ...args: A ): Promise<IParseResult<O, A>> {

        const actionOption = this.findActionFlag( options );

        if ( actionOption && actionOption.action ) {
            await actionOption.action.call( this, options, ...args );
            return { options, args: args as any as A, cmd: this, literal: this.literalArgs };
        }

        if ( this.fn ) {

            try {
                await this.fn( options, ...args );
            } catch ( e ) {
                throw this.error( e );
            }

        } else if ( this.defaultCommand ) {

            const cmd = this.getCommand( this.defaultCommand, true );

            if ( !cmd ) {
                throw this.error( new Error( `Default command '${ this.defaultCommand }' not found.` ) );
            }

            cmd._globalParent = this;

            try {
                await cmd.execute( options, ...args );
            } catch ( e ) {
                throw this.error( e );
            }
        }

        return { options, args: args as any as A, cmd: this, literal: this.literalArgs };
    }

    /**
     * Execute external sub-command.
     *
     * @param args Raw command line arguments.
     */
    protected async executeExecutable( args: string[] ) {

        const [ main, ...names ] = this.getPath().split( ' ' );

        names.unshift( main.replace( /\.ts$/, '' ) );

        const executable = names.join( '-' );

        try {
            // @TODO: create getEnv() method which should return all known environment variables and pass it to Deno.run({env})
            await Deno.run( {
                cmd: [ executable, ...args ]
            } );
            return;
        } catch ( e ) {
            if ( !e.message.match( /No such file or directory/ ) ) {
                throw e;
            }
        }

        try {
            await Deno.run( {
                cmd: [ executable + '.ts', ...args ]
            } );
            return;
        } catch ( e ) {
            if ( !e.message.match( /No such file or directory/ ) ) {
                throw e;
            }
        }

        throw this.error( new Error( `Sub-command executable not found: ${ executable }${ dim( '(.ts)' ) }` ) );
    }

    /**
     * Parse command line args.
     *
     * @param args          Command line args.
     */
    protected parseFlags( args: string[] ): IFlagsResult<O> {

        try {
            return parseFlags<O>( args, {
                stopEarly: this._stopEarly,
                // knownFlaks,
                allowEmpty: this._allowEmpty,
                flags: this.getOptions( true ),
                parse: ( type: string, option: IFlagOptions, arg: IFlagArgument, nextValue: string ) =>
                    this.parseType( type, option, arg, nextValue )
            } );
        } catch ( e ) {
            throw this.error( e );
        }
    }

    protected parseType( name: string, option: IFlagOptions, arg: IFlagArgument, nextValue: string ): any {

        const type: ITypeSettings | undefined = this.getType( name );

        if ( !type ) {
            throw this.error( new Error( `No type registered with name: ${ name }` ) );
        }

        // @TODO: pass only name & value to .parse() method
        return type.handler instanceof Type ? type.handler.parse( option, arg, nextValue ) : type.handler( option, arg, nextValue );
    }

    /**
     * Validate environment variables.
     */
    protected validateEnvVars() {

        const envVars = this.getEnvVars( true );

        if ( !envVars.length ) {
            return;
        }

        if ( hasEnvPermissions ) {
            envVars.forEach( ( env: IEnvVariable ) => {
                const name = env.names.find( name => !!Deno.env.get( name ) );
                if ( name ) {
                    const value: string | undefined = Deno.env.get( name );
                    try {
                        // @TODO: optimize handling for environment variable error message: parseFlag & parseEnv ?
                        this.parseType( env.type, { name }, env, value || '' );
                    } catch ( e ) {
                        throw new Error( `Environment variable '${ name }' must be of type ${ env.type } but got: ${ value }` );
                    }
                }
            } );
        }
    }

    /**
     * Match commands and arguments from command line arguments.
     */
    protected parseArguments( args: string[], flags: O ): A {

        const params: IFlagValue[] = [];

        // remove array reference
        args = args.slice( 0 );

        if ( !this.hasArguments() ) {

            if ( args.length ) {
                if ( this.hasCommands( true ) ) {
                    throw this.error( new Error( `Unknown command: ${ args.join( ' ' ) }` ) );
                } else {
                    throw this.error( new Error( `No arguments allowed for command: ${ this._name }` ) );
                }
            }

        } else {

            if ( !args.length ) {

                const required = this.getArguments()
                    .filter( expectedArg => !expectedArg.optionalValue )
                    .map( expectedArg => expectedArg.name );

                if ( required.length ) {
                    const flagNames: string[] = Object.keys( flags );
                    const hasStandaloneOption: boolean = !!flagNames.find( name => this.getOption( name, true )?.standalone );

                    if ( !hasStandaloneOption ) {
                        throw this.error( new Error( 'Missing argument(s): ' + required.join( ', ' ) ) );
                    }
                }

                return params as A;
            }

            for ( const expectedArg of this.getArguments() ) {

                if ( !expectedArg.optionalValue && !args.length ) {
                    throw this.error( new Error( `Missing argument: ${ expectedArg.name }` ) );
                }

                let arg: IFlagValue;

                if ( expectedArg.variadic ) {
                    arg = args.splice( 0, args.length ) as IFlagValueType[];
                } else {
                    arg = args.shift() as IFlagValue;
                }

                if ( arg ) {
                    params.push( arg );
                }
            }

            if ( args.length ) {
                throw this.error( new Error( `To many arguments: ${ args.join( ' ' ) }` ) );
            }
        }

        return params as A;
    }

    /**
     * Execute help command if help flag is set.
     *
     * @param flags Command options.
     */
    protected findActionFlag( flags: O ): IOption | undefined {

        const flagNames = Object.keys( flags );

        for ( const flag of flagNames ) {

            const option = this.getOption( flag, true );

            if ( option?.action ) {
                return option;
            }
        }

        return;
    }

    /********************************************************************************
     **** GETTER ********************************************************************
     ********************************************************************************/

    /**
     * Get command name.
     */
    public getName(): string {
        return this._name;
    }

    /**
     * Get parent command.
     */
    public getParent(): Command | undefined {
        return this._parent;
    }

    /**
     * Get parent command from global executed command.
     * Be sure, to call this method only inside an action handler. Unless this or any child command was executed,
     * this method returns always undefined.
     */
    public getGlobalParent(): Command | undefined {
        return this._globalParent;
    }

    /**
     * Get main command.
     */
    public getMainCommand(): Command {
        return this._parent?.getMainCommand() ?? this;
    }

    /**
     * Get command name aliases.
     */
    public getAliases(): string[] {
        return this.aliases;
    }

    /**
     * Get full command path of all parent command names's and current command name.
     */
    public getPath(): string {

        return this._parent ? this._parent.getPath() + ' ' + this._name : this._name;
    }

    /**
     * Get arguments definition.
     */
    public getArgsDefinition(): string | undefined {

        return this.argsDefinition;
    }

    /**
     * Get argument.
     */
    public getArgument( name: string ): IArgumentDetails | undefined {

        return this.getArguments().find( arg => arg.name === name );
    }

    /**
     * Get arguments.
     */
    public getArguments(): IArgumentDetails[] {

        if ( !this.args.length && this.argsDefinition ) {
            this.args = ArgumentsParser.parseArgumentsDefinition( this.argsDefinition );
        }

        return this.args;
    }

    /**
     * Check if command has arguments.
     */
    public hasArguments() {
        return !!this.argsDefinition;
    }

    /**
     * Get command version.
     */
    public getVersion(): string {
        return this.ver || ( this._parent?.getVersion() ?? '' );
    }

    /**
     * Get command description.
     */
    public getDescription(): string {
        // call description method only once
        return typeof this.desc === 'function' ? this.desc = this.desc() : this.desc;
    }

    public getShortDescription(): string {

        return this.getDescription()
            .trim()
            .split( '\n' )
            .shift() as string;
    }

    /**
     * Checks whether the command has options or not.
     */
    public hasOptions( hidden?: boolean ): boolean {

        return this.getOptions( hidden ).length > 0;
    }

    public getOptions( hidden?: boolean ): IOption[] {

        return this.getGlobalOptions( hidden ).concat( this.getBaseOptions( hidden ) );
    }

    public getBaseOptions( hidden?: boolean ): IOption[] {

        if ( !this.options.length ) {
            return [];
        }

        return hidden ? this.options.slice( 0 ) : this.options.filter( opt => !opt.hidden );
    }

    public getGlobalOptions( hidden?: boolean ): IOption[] {

        const getOptions = ( cmd: Command | undefined, options: IOption[] = [], names: string[] = [] ): IOption[] => {

            if ( cmd ) {
                if ( cmd.options.length ) {
                    cmd.options.forEach( ( option: IOption ) => {
                        if (
                            option.global &&
                            !this.options.find( opt => opt.name === option.name ) &&
                            names.indexOf( option.name ) === -1 &&
                            ( hidden || !option.hidden )
                        ) {
                            names.push( option.name );
                            options.push( option );
                        }
                    } );
                }

                return getOptions( cmd._parent, options, names );
            }

            return options;
        };

        return getOptions( this._parent );
    }

    /**
     * Checks whether the command has an option with given name or not.
     *
     * @param name Name of the option. Must be in param-case.
     * @param hidden Include hidden options.
     */
    public hasOption( name: string, hidden?: boolean ): boolean {

        return !!this.getOption( name, hidden );
    }

    /**
     * Get option by name.
     *
     * @param name Name of the option. Must be in param-case.
     * @param hidden Include hidden options.
     */
    public getOption( name: string, hidden?: boolean ): IOption | undefined {

        return this.getBaseOption( name, hidden ) ?? this.getGlobalOption( name, hidden );
    }

    /**
     * Get base option by name.
     *
     * @param name Name of the option. Must be in param-case.
     * @param hidden Include hidden options.
     */
    public getBaseOption( name: string, hidden?: boolean ): IOption | undefined {

        const option = this.options.find( option => option.name === name );

        return option && ( hidden || !option.hidden ) ? option : undefined;
    }

    /**
     * Get global option from parent command's by name.
     *
     * @param name Name of the option. Must be in param-case.
     * @param hidden Include hidden options.
     */
    public getGlobalOption( name: string, hidden?: boolean ): IOption | undefined {

        if ( !this._parent ) {
            return;
        }

        let option: IOption | undefined = this._parent.getBaseOption( name, hidden );

        if ( !option || !option.global ) {
            return this._parent.getGlobalOption( name, hidden );
        }

        return option;
    }

    /**
     * Remove option by name.
     *
     * @param name Name of the option. Must be in param-case.
     */
    public removeOption( name: string ): IOption | undefined {

        const index = this.options.findIndex( option => option.name === name );

        if ( index === -1 ) {
            return;
        }

        return this.options.splice( index, 1 )[ 0 ];
    }

    /**
     * Checks whether the command has sub-commands or not.
     */
    public hasCommands( hidden?: boolean ): boolean {

        return this.getCommands( hidden ).length > 0;
    }

    /**
     * Get sub-commands.
     */
    public getCommands( hidden?: boolean ): Command[] {

        return this.getGlobalCommands( hidden ).concat( this.getBaseCommands( hidden ) );
    }

    public getBaseCommands( hidden?: boolean ): Command[] {
        const commands = Array.from( this.commands.values() );
        return hidden ? commands : commands.filter( cmd => !cmd.isHidden );
    }

    public getGlobalCommands( hidden?: boolean ): Command[] {

        const getCommands = ( cmd: Command | undefined, commands: Command[] = [], names: string[] = [] ): Command[] => {

            if ( cmd ) {
                if ( cmd.commands.size ) {
                    cmd.commands.forEach( ( cmd: Command ) => {
                        if (
                            cmd.isGlobal &&
                            this !== cmd &&
                            !this.commands.has( cmd._name ) &&
                            names.indexOf( cmd._name ) === -1 &&
                            ( hidden || !cmd.isHidden )
                        ) {
                            names.push( cmd._name );
                            commands.push( cmd );
                        }
                    } );
                }

                return getCommands( cmd._parent, commands, names );
            }

            return commands;
        };

        return getCommands( this._parent );
    }

    /**
     * Checks whether the command has a sub-command with given name or not.
     *
     * @param name Name of the command.
     * @param hidden Include hidden commands.
     */
    public hasCommand( name: string, hidden?: boolean ): boolean {

        return !!this.getCommand( name, hidden );
    }

    /**
     * Get sub-command with given name.
     *
     * @param name Name of the sub-command.
     * @param hidden Include hidden commands.
     */
    public getCommand<O = any>( name: string, hidden?: boolean ): Command<O> | undefined {

        return this.getBaseCommand( name, hidden ) ?? this.getGlobalCommand( name, hidden );
    }

    public getBaseCommand<O = any>( name: string, hidden?: boolean ): Command<O> | undefined {

        let cmd: Command | undefined = this.commands.get( name );

        return cmd && ( hidden || !cmd.isHidden ) ? cmd : undefined;
    }

    public getGlobalCommand<O = any>( name: string, hidden?: boolean ): Command<O> | undefined {

        if ( !this._parent ) {
            return;
        }

        let cmd: Command | undefined = this._parent.getBaseCommand( name, hidden );

        if ( !cmd?.isGlobal ) {
            return this._parent.getGlobalCommand( name, hidden );
        }

        return cmd;
    }

    /**
     * Remove sub-command with given name.
     *
     * @param name Name of the command.
     */
    public removeCommand<O = any>( name: string ): Command<O> | undefined {

        const command = this.getBaseCommand( name, true );

        if ( command ) {
            this.commands.delete( name );
        }

        return command;
    }

    public getTypes(): ITypeSettings[] {
        return this.getGlobalTypes().concat( this.getBaseTypes() );
    }

    public getBaseTypes(): ITypeSettings[] {
        return Array.from( this.types.values() );
    }

    public getGlobalTypes(): ITypeSettings[] {

        const getTypes = ( cmd: Command | undefined, types: ITypeSettings[] = [], names: string[] = [] ): ITypeSettings[] => {

            if ( cmd ) {
                if ( cmd.types.size ) {
                    cmd.types.forEach( ( type: ITypeSettings ) => {
                        if (
                            type.global &&
                            !this.types.has( type.name ) &&
                            names.indexOf( type.name ) === -1
                        ) {
                            names.push( type.name );
                            types.push( type );
                        }
                    } );
                }

                return getTypes( cmd._parent, types, names );
            }

            return types;
        };

        return getTypes( this._parent );
    }

    protected getType( name: string ): ITypeSettings | undefined {

        return this.getBaseType( name ) ?? this.getGlobalType( name );
    }

    protected getBaseType( name: string ): ITypeSettings | undefined {

        return this.types.get( name );
    }

    protected getGlobalType( name: string ): ITypeSettings | undefined {

        if ( !this._parent ) {
            return;
        }

        let cmd: ITypeSettings | undefined = this._parent.getBaseType( name );

        if ( !cmd?.global ) {
            return this._parent.getGlobalType( name );
        }

        return cmd;
    }

    /**
     * Checks whether the command has environment variables or not.
     */
    public hasEnvVars( hidden?: boolean ): boolean {

        return this.getEnvVars( hidden ).length > 0;
    }

    /**
     * Get environment variables.
     */
    public getEnvVars( hidden?: boolean ): IEnvVariable[] {

        return this.getGlobalEnvVars( hidden ).concat( this.getBaseEnvVars( hidden ) );
    }

    public getBaseEnvVars( hidden?: boolean ): IEnvVariable[] {

        if ( !this.envVars.length ) {
            return [];
        }

        return hidden ? this.envVars.slice( 0 ) : this.envVars.filter( env => !env.hidden );
    }

    public getGlobalEnvVars( hidden?: boolean ): IEnvVariable[] {

        const getEnvVars = ( cmd: Command | undefined, envVars: IEnvVariable[] = [], names: string[] = [] ): IEnvVariable[] => {

            if ( cmd ) {
                if ( cmd.envVars.length ) {
                    cmd.envVars.forEach( ( envVar: IEnvVariable ) => {
                        if (
                            envVar.global &&
                            !this.envVars.find( env => env.names[ 0 ] === envVar.names[ 0 ] ) &&
                            names.indexOf( envVar.names[ 0 ] ) === -1 &&
                            ( hidden || !envVar.hidden )
                        ) {
                            names.push( envVar.names[ 0 ] );
                            envVars.push( envVar );
                        }
                    } );
                }

                return getEnvVars( cmd._parent, envVars, names );
            }

            return envVars;
        };

        return getEnvVars( this._parent );
    }

    /**
     * Checks whether the command has an environment variable with given name or not.
     *
     * @param name Name of the environment variable.
     * @param hidden Include hidden environment variable.
     */
    public hasEnvVar( name: string, hidden?: boolean ): boolean {

        return !!this.getEnvVar( name, hidden );
    }

    /**
     * Get environment variable with given name.
     *
     * @param name Name of the environment variable.
     * @param hidden Include hidden environment variable.
     */
    public getEnvVar( name: string, hidden?: boolean ): IEnvVariable | undefined {

        return this.getBaseEnvVar( name, hidden ) ?? this.getGlobalEnvVar( name, hidden );
    }

    public getBaseEnvVar( name: string, hidden?: boolean ): IEnvVariable | undefined {

        const envVar: IEnvVariable | undefined = this.envVars.find( env => env.names.indexOf( name ) !== -1 );

        return envVar && ( hidden || !envVar.hidden ) ? envVar : undefined;
    }

    public getGlobalEnvVar( name: string, hidden?: boolean ): IEnvVariable | undefined {

        if ( !this._parent ) {
            return;
        }

        let envVar: IEnvVariable | undefined = this._parent.getBaseEnvVar( name, hidden );

        if ( !envVar?.global ) {
            return this._parent.getGlobalEnvVar( name, hidden );
        }

        return envVar;
    }

    /**
     * Checks whether the command has examples or not.
     */
    public hasExamples(): boolean {

        return this.examples.length > 0;
    }

    /**
     * Get examples.
     */
    public getExamples(): IExample[] {

        return this.examples;
    }

    /**
     * Checks whether the command has an example with given name or not.
     *
     * @param name Name of the example.
     */
    public hasExample( name: string ): boolean {

        return !!this.getExample( name );
    }

    /**
     * Get example with given name.
     *
     * @param name Name of the example.
     */
    public getExample( name: string ): IExample | undefined {

        return this.examples.find( example => example.name === name );
    }

    public getRawArgs(): string[] {
        return this.rawArgs;
    }

    public getLiteralArgs(): string[] {
        return this.literalArgs;
    }

    /********************************************************************************
     **** HELPER ********************************************************************
     ********************************************************************************/

    /**
     * Write line to stdout without line break.
     *
     * @param args Data to write to stdout.
     */
    public write( ...args: any[] ) {

        stdout.writeSync( encode( fill( 2 ) + format( ...args ) ) );
    }

    /**
     * Write line to stderr without line break.
     *
     * @param args Data to write to stdout.
     */
    public writeError( ...args: any[] ) {

        stderr.writeSync( encode( fill( 2 ) + red( format( `[ERROR:${ this._name }]`, ...args ) ) ) );
    }

    /**
     * Write line to stdout.
     *
     * @param args Data to write to stdout.
     */
    public log( ...args: any[] ) {

        this.write( ...args, '\n' );
    }

    /**
     * Write line to stderr.
     *
     * @param args Data to write to stderr.
     */
    public logError( ...args: any[] ) {

        this.writeError( ...args, '\n' );
    }

    /**
     * Handle error. If `.throwErrors()` was called all error's will be thrown, otherwise `Deno.exit(1)` will be called.
     *
     * @param error Error to handle.
     * @param showHelp Show help.
     */
    public error( error: Error, showHelp: boolean = true ): Error {

        if ( this.shouldThrowErrors() ) {
            return error;
        }

        const CLIFFY_DEBUG: boolean = hasEnvPermissions ? !!Deno.env.get( 'CLIFFY_DEBUG' ) : false;

        showHelp && this.help();
        this.logError( CLIFFY_DEBUG ? error : error.message );
        this.log();

        Deno.exit( 1 );
    }

    /**
     * Output generated help without exiting.
     */
    public help() {
        Deno.stdout.writeSync( encode( this.getHelp() ) );
    }

    /**
     * Get generated help.
     */
    public getHelp(): string {
        this.registerDefaults();
        return HelpGenerator.generate( this );
    }
}
