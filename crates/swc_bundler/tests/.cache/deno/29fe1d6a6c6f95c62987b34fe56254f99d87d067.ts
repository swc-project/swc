// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/command/types/child-command.ts


import { Command } from '../lib/command.ts';
import { StringType } from './string.ts';

// @TODO: add exclude option

export class ChildCommandType extends StringType {

    #cmd?: Command;

    constructor( cmd?: Command ) {
        super();
        this.#cmd = cmd;
    }

    public complete( cmd: Command ): string[] {
        return ( this.#cmd ?? cmd )?.getCommands( false )
            .map( ( cmd: Command ) => cmd.getName() ) || [];
    }
}
