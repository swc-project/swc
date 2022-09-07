//// [importCallExpressionInSystem4.ts]
System.register([], function(_export, _context) {
    return {
        setters: [],
        execute: function() {}
    };
});
//// [0.ts]
System.register([], function(_export, _context) {
    return _export({
        B: void 0,
        foo: function() {
            return "foo";
        }
    }), {
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
//// [1.ts]
System.register([], function(_export, _context) {
    return _export("backup", function() {
        return "backup";
    }), {
        setters: [],
        execute: function() {}
    };
});
//// [2.ts]
System.register([], function(_export, _context) {
    return _export("D", void 0), {
        setters: [],
        execute: async function() {
            _export("D", class {
                myModule = _context.import("./0");
                method() {
                    _context.import("./0"), this.myModule.then((Zero)=>{
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
