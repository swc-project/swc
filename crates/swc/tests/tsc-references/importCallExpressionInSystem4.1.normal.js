//// [importCallExpressionInSystem4.ts]
System.register([], function(_export, _context) {
    "use strict";
    return {
        setters: [],
        execute: function() {}
    };
});
//// [0.ts]
System.register([], function(_export, _context) {
    "use strict";
    var B;
    function foo() {
        return "foo";
    }
    _export({
        B: void 0,
        foo: foo
    });
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
//// [1.ts]
System.register([], function(_export, _context) {
    "use strict";
    function backup() {
        return "backup";
    }
    _export("backup", backup);
    return {
        setters: [],
        execute: function() {}
    };
});
//// [2.ts]
System.register([], function(_export, _context) {
    "use strict";
    var C, D;
    _export("D", void 0);
    return {
        setters: [],
        execute: async function() {
            C = class C {
                myModule = _context.import("./0");
                method() {
                    const loadAsync = _context.import("./0");
                    this.myModule.then((Zero)=>{
                        console.log(Zero.foo());
                    }, async (err)=>{
                        console.log(err);
                        let one = await import("./1");
                        console.log(one.backup());
                    });
                }
            };
            _export("D", D = class D {
                myModule = _context.import("./0");
                method() {
                    const loadAsync = _context.import("./0");
                    this.myModule.then((Zero)=>{
                        console.log(Zero.foo());
                    }, async (err)=>{
                        console.log(err);
                        let one = await import("./1");
                        console.log(one.backup());
                    });
                }
            });
        }
    };
});
