//// [topLevelVarHoistingSystem.ts]
System.register([], function(_export, _context) {
    "use strict";
    function f() {
        console.log(y);
    }
    return {
        setters: [],
        execute: function() {
            if (false) {
                var y = 1;
            }
        }
    };
});
