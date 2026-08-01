//// [topLevelVarHoistingSystem.ts]
System.register([], function(_export, _context) {
    "use strict";
    var y;
    function f() {
        console.log(y);
    }
    _export("y", void 0);
    return {
        setters: [],
        execute: function() {
            if (false) {
                y = 1, _export("y", y), y;
            }
        }
    };
});
