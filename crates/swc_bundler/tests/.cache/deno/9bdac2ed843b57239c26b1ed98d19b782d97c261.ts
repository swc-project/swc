// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/x/format.ts


// Copied from https://github.com/defunctzombie/node-util/blob/master/util.ts
// Modified to format %o and %O as deno objects
const { inspect } = Deno;

const formatRegExp = /%[sdjoO%]/g;

export default function format( ...args: any[] ) {
    if ( typeof args[ 0 ] !== 'string' ) {
        let objects = [];
        for ( let i = 0; i < arguments.length; i++ ) {
            objects.push( inspect( arguments[ i ] ) );
        }
        return objects.join( ' ' );
    }

    let i = 1;
    const f = args[ 0 ];
    const len = args.length;
    let str = String( f ).replace( formatRegExp, function ( x ) {
        if ( x === '%%' ) {
            return '%';
        }
        if ( i >= len ) {
            return x;
        }
        switch ( x ) {
            case '%s':
                return String( args[ i++ ] );
            case '%d':
                return String( Number( args[ i++ ] ) );
            case '%j':
                try {
                    return JSON.stringify( args[ i++ ] );
                } catch ( _ ) {
                    return '[Circular]';
                }
            case '%o':
            case '%O':
                return inspect( args[ i++ ] );
            default:
                return x;
        }
    } );
    for ( let x = args[ i ]; i < len; x = args[ ++i ] ) {
        if ( x == null || typeof x !== 'object' ) {
            str += ' ' + x;
        } else {
            str += ' ' + inspect( x );
        }
    }
    return str;
}
