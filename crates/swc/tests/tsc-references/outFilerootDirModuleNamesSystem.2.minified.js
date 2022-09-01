//// [src/a.ts]
System.register([
    "./b"
], function(_export, _context) {
    "use strict";
    var foo;
    return _export("default", void 0), {
        setters: [
            function(_b) {
                foo = _b.default;
            }
        ],
        execute: function() {
            _export("default", class {
            }), foo();
        }
    };
});
//// [src/b.ts]
System.register([
    "./a"
], function(_export, _context) {
    "use strict";
    var Foo;
    return _export("default", function() {
        new Foo();
    }), {
        setters: [
            function(_a) {
                Foo = _a.default;
            }
        ],
        execute: function() {
            _context.import("./a");
        }
    };
});
