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
// We use Promise<any> for now as there is no way to specify shape of module object
System.register([], function(_export, _context) {
    "use strict";
    function foo(x) {
        x.then((value)=>{
            let b = new value.B();
            b.print();
        });
    }
    return {
        setters: [],
        execute: function() {
            foo(_context.import("./0"));
        }
    };
});
