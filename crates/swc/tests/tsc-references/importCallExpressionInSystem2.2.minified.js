//// [0.ts]
System.register([], function(_export, _context) {
    "use strict";
    var B;
    return _export("B", void 0), {
        setters: [],
        execute: function() {
            _export("B", B = class {
                print() {
                    return "I am B";
                }
            });
        }
    };
});
//// [2.ts]
System.register([], function(_export, _context) {
    return {
        setters: [],
        execute: function() {
            !function(x) {
                x.then((value)=>{
                    new value.B().print();
                });
            }(_context.import("./0"));
        }
    };
});
