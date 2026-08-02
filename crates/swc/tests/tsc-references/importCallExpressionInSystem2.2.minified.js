//// [0.ts]
System.register([], function(_export, _context) {
    "use strict";
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
    return {
        setters: [],
        execute: function() {
            _context.import("./0").then((value)=>{
                new value.B().print();
            });
        }
    };
});
