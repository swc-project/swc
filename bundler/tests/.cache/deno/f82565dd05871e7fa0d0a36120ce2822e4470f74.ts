// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/command/types/number.ts


import { IFlagArgument, IFlagOptions } from '../../flags/lib/types.ts';
import { number } from '../../flags/lib/types/number.ts';
import { Type } from './type.ts';

export class NumberType extends Type<number> {

    public parse( option: IFlagOptions, arg: IFlagArgument, value: string ): number {
        return number( option, arg, value );
    }
}
