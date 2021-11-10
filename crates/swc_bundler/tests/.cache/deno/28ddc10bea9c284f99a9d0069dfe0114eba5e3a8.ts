// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/command/commands/help.ts


import { IFlags } from '../../flags/lib/types.ts';
import { Command } from '../lib/command.ts';
import { CommandType } from '../types/command.ts';

/**
 * Generates well formatted and colored help output for specified command.
 */
export class HelpCommand extends Command {

    public constructor( cmd?: Command ) {
        super();
        this.type( 'command', new CommandType() )
            .arguments( '[command:command]' )
            .description( 'Show this help or the help of a sub-command.' )
            .action( ( flags: IFlags, name?: string ) => {
                if ( !cmd ) {
                    cmd = name ? this.getGlobalParent()?.getBaseCommand( name ) : this.getGlobalParent();
                }
                if ( !cmd ) {
                    throw new Error( `Failed to generate help for command '${ name }'. Command not found.` );
                }
                cmd.help();
                Deno.exit( 0 );
            } );
    }
}
