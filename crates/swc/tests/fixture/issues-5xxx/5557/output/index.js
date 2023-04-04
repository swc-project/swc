import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
var commands;
var command;
function retornaTempoArenaEmMilisegundos(distancia, velocidade) {
    var conv = distancia * function() {
        "use strict";
        function LogExit(param) {
            var logger = param.logger;
            _class_call_check(this, LogExit);
            this.logger = logger;
        }
        _create_class(LogExit, [
            {
                key: "handle",
                value: function handle(commands) {
                    var _this = this;
                    commands.forEach(function(command) {
                        return command.close.subscribe(function(param) {
                            var exitCode = param.exitCode;
                            _this.logger.logCommandEvent("".concat(command.command, " exited with code ").concat(exitCode), command);
                        });
                    });
                    return commands;
                }
            }
        ]);
        return LogExit;
    }() / velocidade * 1000;
    return Math.round(conv);
}
