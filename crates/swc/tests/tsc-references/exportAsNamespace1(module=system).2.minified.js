//// [0.ts]
System.register([], function(_export, _context) {
    return {
        setters: [],
        execute: function() {
            _export("a", 1), _export("b", 2);
        }
    };
});
//// [1.ts]
System.register([
    "./0"
], function(_export, _context) {
    return {
        setters: [
            function(_0) {}
        ],
        execute: function() {
            _export("_ns", ns), ns.a, ns.b;
        }
    };
});
//// [2.ts]
System.register([
    "./1"
], function(_export, _context) {
    var foo;
    return {
        setters: [
            function(_1) {
                foo = _1;
            }
        ],
        execute: function() {
            foo.ns.a, foo.ns.b;
        }
    };
});
