// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/flags/lib/types/string.ts


import { IFlagArgument, IFlagOptions, ITypeHandler } from '../types.ts';

export const string: ITypeHandler<string> = ( option: IFlagOptions, arg: IFlagArgument, value: string ): string => {

    return value;
};
