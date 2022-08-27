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
    "@swc/helpers/src/_class_call_check.mjs"
], function(_export, _context) {
    "use strict";
    var _class_call_check, p1, p2, C, D;
    return {
        setters: [
            function(_classCallCheck) {
                _class_call_check = _classCallCheck.default;
            }
        ],
        execute: function() {
            _context.import("./0"), (p1 = _context.import("./0")).then(function(zero) {
                return zero.foo();
            }), _export("p2", p2 = _context.import("./0")), C = function() {
                "use strict";
                function C() {
                    _class_call_check(this, C);
                }
                return C.prototype.method = function() {
                    import("./0");
                }, C;
            }(), _export("D", D = function() {
                "use strict";
                function D() {
                    _class_call_check(this, D);
                }
                return D.prototype.method = function() {
                    import("./0");
                }, D;
            }());
        }
    };
});
