// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/command/types/string.ts


import { IFlagArgument, IFlagOptions } from '../../flags/lib/types.ts';
import { string } from '../../flags/lib/types/string.ts';
import { Type } from './type.ts';

export class StringType extends Type<string> {

    public parse( option: IFlagOptions, arg: IFlagArgument, value: string ): string {
        return string( option, arg, value );
    }
}
