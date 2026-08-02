//// [0.ts]
System.register([], function(_export, _context) {
    "use strict";
    return _export({
        a: void 0,
        b: void 0
    }), {
        setters: [],
        execute: function() {
            _export("a", 1), _export("b", 2);
        }
    };
});
//// [1.ts]
System.register([
    "./0"
], function(_export, _context) {
    "use strict";
    return _export("default", void 0), {
        setters: [
            function(_0_ns) {
                _export("default", _0_ns);
            }
        ],
        execute: function() {}
    };
});
//// [11.ts]
System.register([
    "./0"
], function(_export, _context) {
    "use strict";
    var ns;
    return _export("default", void 0), {
        setters: [
            function(_0_ns) {
                ns = _0_ns;
            }
        ],
        execute: function() {
            _export("default", ns);
        }
    };
});
//// [2.ts]
System.register([
    "./1",
    "./11"
], function(_export, _context) {
    "use strict";
    var foo, foo1;
    return {
        setters: [
            function(_1_ns) {
                foo = _1_ns.default;
            },
            function(_11_ns) {
                foo1 = _11_ns.default;
            }
        ],
        execute: function() {
            foo.a, foo1.a, foo.b, foo1.b;
        }
    };
});
