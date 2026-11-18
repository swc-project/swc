//// [0.ts]
System.register([], function(_export, _context) {
    return _export({
        a: void 0,
        b: void 0
    }), {
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
    return _export("ns", void 0), {
        setters: [
            function(_0_ns) {
                _export("ns", _0_ns);
            }
        ],
        execute: function() {
            ns.a, ns.b;
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
            function(_1_ns) {
                foo = _1_ns;
            }
        ],
        execute: function() {
            foo.ns.a, foo.ns.b;
        }
    };
});
