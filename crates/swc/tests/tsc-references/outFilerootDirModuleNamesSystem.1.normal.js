//// [src/a.ts]
System.register([
    "./b"
], function(_export, _context) {
    "use strict";
    var Foo, foo;
    _export("default", void 0);
    return {
        setters: [
            function(_b_ns) {
                foo = _b_ns.default;
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
            function(_a_ns) {
                Foo = _a_ns.default;
            }
        ],
        execute: function() {
            // https://github.com/microsoft/TypeScript/issues/37429
            _context.import("./a");
        }
    };
});
