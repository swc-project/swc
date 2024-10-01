//// [usingDeclarationsWithLegacyClassDecorators.2.ts]
System.register([], function(_export, _context) {
    return _export("C", void 0), {
        setters: [],
        execute: function() {
            using before = null
            _export("C", @dec
            class {
            });
        }
    };
});
