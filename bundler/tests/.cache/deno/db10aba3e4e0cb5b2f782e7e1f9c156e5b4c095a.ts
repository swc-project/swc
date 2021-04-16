// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/command/lib/arguments-parser.ts


import { green, magenta, red, yellow } from 'https://deno.land/std@0.63.0/fmt/colors.ts';
import { OptionType } from '../../flags/lib/types.ts';
import { IArgumentDetails } from './types.ts';

export class ArgumentsParser {

    private static readonly ARGUMENT_REGEX = /^[<\[].+[\]>]$/;
    private static readonly ARGUMENT_DETAILS_REGEX = /[<\[:>\]]/;

    public static splitArguments( args: string ): { args: string[], typeDefinition: string } {

        const parts = args.trim().split( /[, =] */g );
        const typeParts = [];

        while ( parts[ parts.length - 1 ] && this.ARGUMENT_REGEX.test( parts[ parts.length - 1 ] ) ) {
            typeParts.unshift( parts.pop() );
        }

        const typeDefinition: string = typeParts.join( ' ' );

        return { args: parts, typeDefinition };
    }

    public static parseArgumentsDefinition( argsDefinition: string ): IArgumentDetails[] {

        const argumentDetails: IArgumentDetails[] = [];

        let hasOptional = false;
        let hasVariadic = false;
        const parts: string[] = argsDefinition.split( / +/ );

        for ( const arg of parts ) {

            if ( hasVariadic ) {
                throw new Error( 'An argument can not follow an variadic argument.' );
            }

            const parts: string[] = arg.split( this.ARGUMENT_DETAILS_REGEX );
            const type: string | undefined = parts[ 2 ] || OptionType.STRING;

            let details: IArgumentDetails = {
                optionalValue: arg[ 0 ] !== '<',
                name: parts[ 1 ],
                action: parts[ 3 ] || type,
                variadic: false,
                list: type ? arg.indexOf( type + '[]' ) !== -1 : false,
                type
            };

            if ( !details.optionalValue && hasOptional ) {
                throw new Error( 'An required argument can not follow an optional argument.' );
            }

            if ( arg[ 0 ] === '[' ) {
                hasOptional = true;
            }

            if ( details.name.length > 3 ) {

                const istVariadicLeft = details.name.slice( 0, 3 ) === '...';
                const istVariadicRight = details.name.slice( -3 ) === '...';

                hasVariadic = details.variadic = istVariadicLeft || istVariadicRight;

                if ( istVariadicLeft ) {
                    details.name = details.name.slice( 3 );
                } else if ( istVariadicRight ) {
                    details.name = details.name.slice( 0, -3 );
                }
            }

            if ( details.name ) {
                argumentDetails.push( details );
            }
        }

        return argumentDetails;
    }

    public static highlightArguments( argsDefinition: string ) {

        if ( !argsDefinition ) {
            return '';
        }

        return this.parseArgumentsDefinition( argsDefinition )
            .map( ( arg: IArgumentDetails ) => this.highlightArgumentDetails( arg ) ).join( ' ' );
    }

    public static highlightArgumentDetails( arg: IArgumentDetails ): string {

        let str = '';

        str += yellow( arg.optionalValue ? '[' : '<' );

        let name = '';
        name += arg.name;
        if ( arg.variadic ) {
            name += '...';
        }
        name = magenta( name );

        str += name;

        // if ( arg.name !== arg.type ) {
        str += yellow( ':' );
        str += red( arg.type );
        // }

        if ( arg.list ) {
            str += green( '[]' );
        }

        str += yellow( arg.optionalValue ? ']' : '>' );

        return str;
    }
}
