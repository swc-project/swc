// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/flags/lib/normalize.ts


/**
 * Normalize command line arguments.
 *
 * @param args Command line arguments e.g: `Deno.args`
 */
export function normalize( args: string[] ) {

    const normalized = [];
    let inLiteral = false;

    for ( const arg of args ) {

        if ( inLiteral ) {
            normalized.push( arg );

        } else if ( arg === '--' ) {
            inLiteral = true;
            normalized.push( arg );

        } else if ( arg[ 0 ] === '-' ) {
            const isLong = arg[ 1 ] === '-';

            if ( arg.includes( '=' ) ) {
                const parts = arg.split( '=' );
                const flag = parts.shift() as string;

                if ( isLong ) {
                    normalized.push( flag );
                } else {
                    normalizeShortFlags( flag );
                }
                normalized.push( parts.join( '=' ) );

            } else if ( isLong ) {
                normalized.push( arg );

            } else {
                normalizeShortFlags( arg );
            }
        } else {
            normalized.push( arg );
        }
    }

    return normalized;

    function normalizeShortFlags( flag: string ): void {

        const flags = flag.slice( 1 ).split( '' );

        if ( isNaN( flag[ flag.length - 1 ] as any ) ) {
            flags.forEach( val => normalized.push( `-${ val }` ) );
        } else {
            normalized.push( `-${ flags.shift() }` );
            normalized.push( flags.join( '' ) );
        }
    }
}
