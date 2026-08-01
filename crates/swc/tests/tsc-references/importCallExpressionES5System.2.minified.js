//// [0.ts]
System.register([], function(_export, _context) {
    return _export("foo", function() {
        return "foo";
    }), {
        setters: [],
        execute: function() {}
    };
});
//// [1.ts]
System.register([
    "@swc/helpers/_/_class_call_check"
], function(_export, _context) {
    return _export({
        D: void 0,
        p2: void 0
    }), {
        setters: [
            function(_class_call_check_ns) {
                _class_call_check_ns._;
            }
        ],
        execute: function() {
            _context.import("./0"), _context.import("./0").then(function(zero) {
                return zero.foo();
            }), _export("p2", _context.import("./0"));
        }
    };
});
