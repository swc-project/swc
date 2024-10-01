//// [usingDeclarationsWithLegacyClassDecorators.1.ts]
System.register([], function(_export, _context) {
    "use strict";
    var C;
    return {
        setters: [],
        execute: function() {
            using before = null
            C = @dec
            class C {
            };
        }
    };
});
