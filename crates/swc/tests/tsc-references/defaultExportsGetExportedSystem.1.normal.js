//// [a.ts]
System.register([], function(_export, _context) {
    "use strict";
    var Foo;
    _export("default", void 0);
    return {
        setters: [],
        execute: function() {
            _export("default", Foo = class Foo {
            });
        }
    };
});
//// [b.ts]
System.register([], function(_export, _context) {
    "use strict";
    function foo() {}
    _export("default", foo);
    return {
        setters: [],
        execute: function() {}
    };
});
