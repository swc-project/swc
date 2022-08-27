//// [0.ts]
System.register([], function(_export, _context) {
    "use strict";
    var B;
    _export("B", void 0);
    return {
        setters: [],
        execute: function() {
            _export("B", B = class B {
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
        class C extends (await import("./0")).B {
        }
        var c = new C();
        c.print();
    }
    return {
        setters: [],
        execute: function() {
            foo();
        }
    };
});
