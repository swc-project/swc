//// [a.ts]
System.register([], function(_export, _context) {
    "use strict";
    var Foo;
    return _export("default", void 0), {
        setters: [],
        execute: function() {
            _export("default", Foo = class {
            });
        }
    };
});
//// [b.ts]
System.register([], function(_export, _context) {
    return _export("default", function() {}), {
        setters: [],
        execute: function() {}
    };
});
