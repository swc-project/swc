// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/command/types/boolean.ts


import { IFlagArgument, IFlagOptions } from '../../flags/lib/types.ts';
import { boolean } from '../../flags/lib/types/boolean.ts';
import { Type } from './type.ts';

export class BooleanType extends Type<boolean> {

    public parse( option: IFlagOptions, arg: IFlagArgument, value: string ): boolean {
        return boolean( option, arg, value );
    }

    public complete(): string[] {
        return [ 'true', 'false' ];
    }
}
