// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/command/types/type.ts


import { IFlagArgument, IFlagOptions } from '../../flags/lib/types.ts';
import { Command } from '../lib/command.ts';

export abstract class Type<T> {

    public abstract parse( option: IFlagOptions, arg: IFlagArgument, value: string ): T

    public complete?( cmd: Command, parent?: Command ): string[];
}
