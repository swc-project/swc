//// [importMetaNarrowing.ts]
System.register([], function(_export, _context) {
    return {
        setters: [],
        execute: function() {
            _context.meta.foo && import.meta.foo();
        }
    };
});
