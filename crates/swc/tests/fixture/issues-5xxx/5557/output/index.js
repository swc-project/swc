var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var commands;
var command;
function retornaTempoArenaEmMilisegundos(distancia, velocidade) {
    var conv = distancia * /*#__PURE__*/ function() {
        "use strict";
        function LogExit(param) {
            var logger = param.logger;
            _class_call_check._(this, LogExit);
            this.logger = logger;
        }
        _create_class._(LogExit, [
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
