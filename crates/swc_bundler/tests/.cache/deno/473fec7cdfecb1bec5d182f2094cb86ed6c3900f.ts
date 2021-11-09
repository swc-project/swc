// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/command/commands/completions/complete.ts


import { encode } from 'https://deno.land/std@0.63.0/encoding/utf8.ts';
import { IFlags } from '../../../flags/lib/types.ts';
import { Command } from '../../lib/command.ts';
import { ICompleteSettings } from '../../lib/types.ts';

/**
 * Execute complete method for specific action and command.
 */
export class CompleteCommand extends Command {

    public constructor( cmd?: Command ) {
        super();
        this.description( 'Get completions for given action from given command.' )
            .arguments( '<action:action> [command...:command]' )
            .action( async ( options: IFlags, action: string, commandNames: string[] ) => {

                let parent: Command | undefined;
                let completeCommand: Command = commandNames
                    .reduce( ( cmd: Command, name: string ): Command => {
                        parent = cmd;
                        const childCmd: Command | undefined = cmd.getCommand( name, false );
                        if ( !childCmd ) {
                            throw new Error( `Auto-completion failed. Command not found: ${ commandNames.join( ' ' ) }` );
                        }
                        return childCmd;
                    }, cmd || this.getMainCommand() );

                const completion: ICompleteSettings | undefined = completeCommand.getCompletion( action );
                const result: string[] = await completion?.complete( completeCommand, parent ) ?? [];

                if ( result?.length ) {
                    Deno.stdout.writeSync( encode( result.join( ' ' ) ) );
                }
            } )
            .default( 'help' )
            .reset();
    }
}
