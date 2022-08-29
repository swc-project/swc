//// [importMetaNarrowing.ts]
System.register([], function(_export, _context) {
    "use strict";
    return {
        setters: [],
        execute: function() {
            if (_context.meta.foo) {
                import.meta.foo();
            }
        }
    };
});
