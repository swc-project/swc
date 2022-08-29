//// [0.ts]
System.register([], function(_export, _context) {
    return _export("foo", function() {
        return "foo";
    }), {
        setters: [],
        execute: function() {}
    };
});
//// [1.ts]
System.register([], function(_export, _context) {
    "use strict";
    var C, D, p1, p2;
    return _export("D", void 0), {
        setters: [],
        execute: function() {
            _context.import("./0"), (p1 = _context.import("./0")).then((zero)=>zero.foo()), _export("p2", p2 = _context.import("./0")), C = class {
                method() {
                    _context.import("./0");
                }
            }, _export("D", D = class {
                method() {
                    _context.import("./0");
                }
            });
        }
    };
});
