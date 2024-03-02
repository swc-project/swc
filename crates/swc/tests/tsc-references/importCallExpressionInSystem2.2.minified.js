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
