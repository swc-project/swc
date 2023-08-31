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
// We use Promise<any> for now as there is no way to specify shape of module object
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
