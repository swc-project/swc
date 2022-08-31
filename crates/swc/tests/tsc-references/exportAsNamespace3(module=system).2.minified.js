//// [0.ts]
System.register([], function(_export, _context) {
    return {
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
    var ns;
    return {
        setters: [
            function(_0) {}
        ],
        execute: function() {
            _export("_ns", ns), ns.a, ns.b, (ns = {
                a: 1,
                b: 2
            }).a, ns.b;
        }
    };
});
//// [2.ts]
System.register([
    "./1"
], function(_export, _context) {
    "use strict";
    var foo;
    return {
        setters: [
            function(_1) {
                foo = _1;
            }
        ],
        execute: function() {
            foo.ns.a, foo.ns.b;
        }
    };
});
