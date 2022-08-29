//// [src/a.ts]
System.register([
    "./b"
], function(_export, _context) {
    "use strict";
    var foo, Foo;
    _export("default", void 0);
    return {
        setters: [
            function(_b) {
                foo = _b.default;
            }
        ],
        execute: function() {
            _export("default", Foo = class Foo {
            });
            foo();
        }
    };
});
//// [src/b.ts]
System.register([
    "./a"
], function(_export, _context) {
    "use strict";
    var Foo;
    function foo() {
        new Foo();
    }
    _export("default", foo);
    return {
        setters: [
            function(_a) {
                Foo = _a.default;
            }
        ],
        execute: function() {
            // https://github.com/microsoft/TypeScript/issues/37429
            _context.import("./a");
        }
    };
});
