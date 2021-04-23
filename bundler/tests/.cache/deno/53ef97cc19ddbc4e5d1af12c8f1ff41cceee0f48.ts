// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/flags/lib/types/boolean.ts


import { IFlagArgument, IFlagOptions, ITypeHandler } from '../types.ts';

export const boolean: ITypeHandler<boolean> = ( option: IFlagOptions, arg: IFlagArgument, value: string ): boolean => {

    if ( ~[ '1', 'true' ].indexOf( value ) ) {
        return true;
    }

    if ( ~[ '0', 'false' ].indexOf( value ) ) {
        return false;
    }

    throw new Error( `Option --${ option.name } must be of type boolean but got: ${ value }` );
};
