//// [0.ts]
System.register([], function(_export, _context) {
    return _export("B", void 0), {
        setters: [],
        execute: function() {
            _export("B", class {
                print() {
                    return "I am B";
                }
            });
        }
    };
});
//// [2.ts]
System.register([], function(_export, _context) {
    "use strict";
    async function foo() {
        class C extends (await _context.import("./0")).B {
        }
        new C().print();
    }
    return {
        setters: [],
        execute: function() {
            foo();
        }
    };
});
