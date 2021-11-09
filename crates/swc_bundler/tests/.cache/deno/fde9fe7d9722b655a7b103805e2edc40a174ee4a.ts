// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/command/lib/help-generator.ts


import { blue, bold, dim, magenta, red, yellow } from 'https://deno.land/std@0.63.0/fmt/colors.ts';
import { IFlagOptions } from '../../flags/lib/types.ts';
import { Table } from '../../table/lib/table.ts';
import format from '../../x/format.ts';
import { ArgumentsParser } from './arguments-parser.ts';
import { Command } from './command.ts';
import { IEnvVariable, IExample, IOption } from './types.ts';

export class HelpGenerator {

    private indent: number = 2;

    public static generate( cmd: Command ): string {
        return new HelpGenerator( cmd ).generate();
    }

    private constructor( protected cmd: Command ) {}

    private generate(): string {
        return this.generateHeader() +
            this.generateDescription() +
            this.generateOptions() +
            this.generateCommands() +
            this.generateEnvironmentVariables() +
            this.generateExamples() +
            '\n';
    }

    private generateHeader(): string {
        return '\n' +
            Table.from( [
                    [ bold( 'Usage:' ), magenta( `${ this.cmd.getName() }${ this.cmd.getArgsDefinition() ? ' ' + this.cmd.getArgsDefinition() : '' }` ) ],
                    [ bold( 'Version:' ), yellow( `v${ this.cmd.getVersion() }` ) ]
                ] )
                .indent( this.indent )
                .padding( 1 )
                .toString() + '\n';
    }

    private generateDescription(): string {
        if ( !this.cmd.getDescription() ) {
            return '';
        }
        return this.label( 'Description' ) +
            Table.from( [
                    [ this.cmd.getDescription() ]
                ] )
                .indent( this.indent * 2 )
                .maxCellWidth( 140 )
                .padding( 1 )
                .toString() + '\n';
    }

    private generateOptions(): string {
        const options = this.cmd.getOptions( false );
        if ( !options.length ) {
            return '';
        }

        const hasTypeDefinitions: boolean = !!options.find( option => !!option.typeDefinition );

        if ( hasTypeDefinitions ) {
            return this.label( 'Options' ) +
                Table.from( [
                        ...options.map( ( option: IOption ) => [
                            option.flags.split( /,? +/g ).map( flag => blue( flag ) ).join( ', ' ),
                            ArgumentsParser.highlightArguments( option.typeDefinition || '' ),
                            red( bold( '-' ) ) + ' ' + option.description.split( '\n' ).shift() as string,
                            this.generateHints( option )
                        ] )
                    ] )
                    .padding( [ 2, 2, 2 ] )
                    .indent( this.indent * 2 )
                    .maxCellWidth( [ 60, 60, 80, 60 ] )
                    .toString() + '\n';
        }

        return this.label( 'Options' ) +
            Table.from( [
                    ...options.map( ( option: IOption ) => [
                        option.flags.split( /,? +/g ).map( flag => blue( flag ) ).join( ', ' ),
                        red( bold( '-' ) ) + ' ' + option.description.split( '\n' ).shift() as string,
                        this.generateHints( option )
                    ] )
                ] )
                .padding( [ 2, 2 ] )
                .indent( this.indent * 2 )
                .maxCellWidth( [ 60, 80, 60 ] )
                .toString() + '\n';
    }

    private generateCommands(): string {
        const commands = this.cmd.getCommands( false );
        if ( !commands.length ) {
            return '';
        }

        const hasTypeDefinitions: boolean = !!commands.find( command => !!command.getArgsDefinition() );

        if ( hasTypeDefinitions ) {
            return this.label( 'Commands' ) +
                Table.from( [
                        ...commands.map( ( command: Command ) => [
                            [ command.getName(), ...command.getAliases() ].map( name => blue( name ) ).join( ', ' ),
                            ArgumentsParser.highlightArguments( command.getArgsDefinition() || '' ),
                            red( bold( '-' ) ) + ' ' + command.getDescription().split( '\n' ).shift() as string
                        ] )
                    ] )
                    .padding( [ 2, 2, 2 ] )
                    .indent( this.indent * 2 )
                    .toString() + '\n';
        }

        return this.label( 'Commands' ) +
            Table.from( [
                    ...commands.map( ( command: Command ) => [
                        [ command.getName(), ...command.getAliases() ].map( name => blue( name ) ).join( ', ' ),
                        red( bold( '-' ) ) + ' ' + command.getDescription().split( '\n' ).shift() as string
                    ] )
                ] )
                .padding( [ 2, 2 ] )
                .indent( this.indent * 2 )
                .toString() + '\n';
    }

    private generateEnvironmentVariables(): string {
        const envVars = this.cmd.getEnvVars( false );
        if ( !envVars.length ) {
            return '';
        }
        return this.label( 'Environment variables' ) +
            Table.from( [
                    ...envVars.map( ( envVar: IEnvVariable ) => [
                        envVar.names.map( ( name: string ) => blue( name ) ).join( ', ' ),
                        ArgumentsParser.highlightArgumentDetails( envVar.details ),
                        `${ red( bold( '-' ) ) } ${ envVar.description }`
                    ] )
                ] )
                .padding( 2 )
                .indent( this.indent * 2 )
                .toString() + '\n';
    }

    private generateExamples(): string {
        const examples = this.cmd.getExamples();
        if ( !examples.length ) {
            return '';
        }
        return this.label( 'Examples' ) +
            Table.from( examples.map( ( example: IExample ) => [
                    dim( bold( `${ capitalize( example.name ) }:` ) ),
                    `\n${ example.description }`
                ] ) )
                .padding( 1 )
                .indent( this.indent * 2 )
                .maxCellWidth( 150 )
                .toString() + '\n';
    }

    private generateHints( option: IFlagOptions ): string {
        const hints = [];

        option.required && hints.push( yellow( `required` ) );
        typeof option.default !== 'undefined' && hints.push( blue( bold( `Default: ` ) ) + blue( format( option.default ) ) );
        option.depends && option.depends.length && hints.push( red( bold( `depends: ` ) ) + option.depends.map( depends => red( depends ) ).join( ', ' ) );
        option.conflicts && option.conflicts.length && hints.push( red( bold( `conflicts: ` ) ) + option.conflicts.map( conflict => red( conflict ) ).join( ', ' ) );

        if ( hints.length ) {
            return `(${ hints.join( ', ' ) })`;
        }

        return '';
    }

    private line( ...args: any[] ) {
        return ( args.length ? ' '.repeat( this.indent ) + format( ...args ) : '' ) + '\n';
    }

    private label( label: string ) {
        return '\n' +
            this.line( bold( `${ label }:` ) ) +
            '\n';
    }
}

function capitalize( string: string ): string {
    return string?.charAt( 0 ).toUpperCase() + string.slice( 1 ) ?? '';
}
