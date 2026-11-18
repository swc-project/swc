//// [src/a.ts]
System.register([
    "./b"
], function(_export, _context) {
    var foo;
    return _export("default", void 0), {
        setters: [
            function(_b_ns) {
                foo = _b_ns.default;
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
    var Foo;
    return _export("default", function() {
        new Foo();
    }), {
        setters: [
            function(_a_ns) {
                Foo = _a_ns.default;
            }
        ],
        execute: function() {
            _context.import("./a");
        }
    };
});
