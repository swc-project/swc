// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/command/types/action-list.ts


import { Command } from '../lib/command.ts';
import { StringType } from './string.ts';

export class ActionListType extends StringType {

    constructor( protected cmd: Command ) {
        super();
    }

    public complete(): string[] {
        return this.cmd.getCompletions()
            .map( type => type.name )
            // filter unique values
            .filter( ( value, index, self ) => self.indexOf( value ) === index );
    }
}
