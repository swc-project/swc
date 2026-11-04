var commands;
var command;
function retornaTempoArenaEmMilisegundos(distancia, velocidade) {
    let conv = distancia * class LogExit {
        constructor({logger}) {
            this.logger = logger;
        }
        handle(commands) {
            commands.forEach(command => command.close.subscribe(({exitCode}) => {
                this.logger.logCommandEvent(`${ command.command } exited with code ${ exitCode }`, command);
            }));
            return commands;
        }
    } / velocidade * 1000;
    return Math.round(conv);
}