//// [usingDeclarationsWithLegacyClassDecorators.2.ts]
System.register([], function(_export, _context) {
    "use strict";
    var C;
    _export("C", void 0);
    return {
        setters: [],
        execute: function() {
            using before = null
            _export("C", C = @dec
            class C {
            });
        }
    };
});
