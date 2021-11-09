// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/command/commands/completions/bash.ts


import { Command } from '../../lib/command.ts';

/**
 * Generates bash completion code.
 */
export class BashCompletionsCommand extends Command {

    public constructor( _cmd?: Command ) {
        super();
        this.description( 'Generate bash shell completions.' )
            .action( () => {
                throw new Error( 'Bash completions not supported at this moment.' );
            } );
    }
}
