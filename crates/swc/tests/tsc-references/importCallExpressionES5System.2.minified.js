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
    var _class_call_check;
    return {
        setters: [
            function(_class_call_check1) {
                _class_call_check = _class_call_check1._;
            }
        ],
        execute: function() {
            _context.import("./0"), _context.import("./0").then(function(zero) {
                return zero.foo();
            }), _export("p2", _context.import("./0")), _export("D", /*#__PURE__*/ function() {
                function D() {
                    _class_call_check(this, D);
                }
                return D.prototype.method = function() {
                    _context.import("./0");
                }, D;
            }());
        }
    };
});
