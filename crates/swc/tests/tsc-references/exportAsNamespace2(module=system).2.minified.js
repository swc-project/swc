//// [0.ts]
System.register([], function(_export, _context) {
    "use strict";
    var a, b;
    return {
        setters: [],
        execute: function() {
            _export("a", a = 1), _export("b", b = 2);
        }
    };
});
//// [1.ts]
System.register([
    "./0"
], function(_export, _context) {
    "use strict";
    var _ns;
    return {
        setters: [
            function(_0) {
                _ns = _0;
            }
        ],
        execute: function() {
            _export("_ns", ns), ns.a, ns.b;
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
