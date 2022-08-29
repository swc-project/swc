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
    var _default;
    return {
        setters: [
            function(_0) {
                _default = _0;
            }
        ],
        execute: function() {
            _export("_default", default);
        }
    };
});
//// [11.ts]
System.register([
    "./0"
], function(_export, _context) {
    "use strict";
    var ns;
    return {
        setters: [
            function(_0) {
                ns = _0;
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
            function(_1) {
                foo = _1.default;
            },
            function(_11) {
                foo1 = _11.default;
            }
        ],
        execute: function() {
            foo.a, foo1.a, foo.b, foo1.b;
        }
    };
});
