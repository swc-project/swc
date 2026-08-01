//// [0.ts]
System.register([], function(_export, _context) {
    "use strict";
    var a, b;
    _export({
        a: void 0,
        b: void 0
    });
    return {
        setters: [],
        execute: function() {
            _export("a", a = 1);
            _export("b", b = 2);
        }
    };
});
//// [1.ts]
System.register([
    "./0"
], function(_export, _context) {
    "use strict";
    var _ns;
    _export("ns", void 0);
    return {
        setters: [
            function(_0_ns) {
                _ns = _0_ns;
                _export("ns", _ns);
            }
        ],
        execute: function() {
            ns.a;
            ns.b;
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
            function(_1_ns) {
                foo = _1_ns;
            }
        ],
        execute: function() {
            foo.ns.a;
            foo.ns.b;
        }
    };
});
