//// [0.ts]
System.register([], function(_export, _context) {
    "use strict";
    function foo() {
        return "foo";
    }
    _export("foo", foo);
    return {
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
    function foo() {
        var p2 = _context.import("./0");
    }
    return {
        setters: [
            function(_classCallCheck) {
                _class_call_check = _classCallCheck.default;
            }
        ],
        execute: function() {
            _context.import("./0");
            p1 = _context.import("./0");
            p1.then(function(zero) {
                return zero.foo();
            });
            _export("p2", p2 = _context.import("./0"));
            C = /*#__PURE__*/ function() {
                "use strict";
                function C() {
                    _class_call_check(this, C);
                }
                var _proto = C.prototype;
                _proto.method = function method() {
                    var loadAsync = import("./0");
                };
                return C;
            }();
            _export("D", D = /*#__PURE__*/ function() {
                "use strict";
                function D() {
                    _class_call_check(this, D);
                }
                var _proto = D.prototype;
                _proto.method = function method() {
                    var loadAsync = import("./0");
                };
                return D;
            }());
        }
    };
});
