//// [0.ts]
System.register([], function(_export, _context) {
    "use strict";
    function foo() {
        return "foo";
    }
    _export("foo", foo);
    return {
        setters: [],
        execute: function() {}
    };
});
//// [1.ts]
System.register([], function(_export, _context) {
    "use strict";
    var C, D, p1, p2;
    function foo() {
        const p2 = _context.import("./0");
    }
    _export("D", void 0);
    return {
        setters: [],
        execute: function() {
            _context.import("./0");
            p1 = _context.import("./0");
            p1.then((zero)=>{
                return zero.foo();
            });
            _export("p2", p2 = _context.import("./0"));
            C = class C {
                method() {
                    const loadAsync = _context.import("./0");
                }
            };
            _export("D", D = class D {
                method() {
                    const loadAsync = _context.import("./0");
                }
            });
        }
    };
});
