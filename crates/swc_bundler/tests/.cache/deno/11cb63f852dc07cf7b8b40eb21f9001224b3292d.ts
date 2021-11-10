// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/command/types/command.ts


import { Command } from '../lib/command.ts';
import { StringType } from './string.ts';

export class CommandType extends StringType {

    public complete( cmd: Command, parent?: Command ): string[] {
        return parent?.getCommands( false )
            .map( ( cmd: Command ) => cmd.getName() ) || [];
    }
}
