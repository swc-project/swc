// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/command/commands/completions.ts


import { bold, dim, italic } from 'https://deno.land/std@0.63.0/fmt/colors.ts';
import { Command } from '../lib/command.ts';
import { BashCompletionsCommand } from './completions/bash.ts';
import { CompleteCommand } from './completions/complete.ts';
import { ZshCompletionsCommand } from './completions/zsh.ts';

/**
 * Generates source code for interactive shell completions used in multiple shell's.
 */
export class CompletionsCommand extends Command {

    public constructor( cmd?: Command ) {

        super();

        this.description( () => {
                cmd = cmd || this.getMainCommand();
                return `Generate shell completions for zsh and bash.

${ dim( bold( 'Bash completions:' ) ) }

To enable bash completions for this program add following line to your ${ dim( italic( '~/.bashrc' ) ) }:

    ${ dim( italic( 'source <(command-name completions bash)' ) ) }

or create a separate file in the ${ dim( italic( 'bash_completion.d' ) ) } directory:

    ${ dim( italic( `${ cmd.getPath() } completions bash > /usr/local/etc/bash_completion.d/${ cmd.getPath() }.bash` ) ) }
    ${ dim( italic( `source /usr/local/etc/bash_completion.d/${ cmd.getPath() }.bash` ) ) }

${ dim( bold( 'Zsh completions:' ) ) }

To enable zsh completions for this program add following line to your ${ dim( italic( '~/.zshrc' ) ) }:

    ${ dim( italic( 'source <(command-name completions zsh)' ) ) }

or create a separate file in the ${ dim( italic( 'zsh_completion.d' ) ) } directory:

    ${ dim( italic( `${ cmd.getPath() } completions zsh > /usr/local/etc/zsh_completion.d/${ cmd.getPath() }.zsh` ) ) }
    ${ dim( italic( `source /usr/local/etc/zsh_completion.d/${ cmd.getPath() }.zsh` ) ) }
`;
            } )

            .default( 'help' )
            .command( 'zsh', new ZshCompletionsCommand( cmd ) )
            .command( 'bash', new BashCompletionsCommand( cmd ) )
            .command( 'complete', new CompleteCommand( cmd ).hidden() )
            .reset();
    }
}
