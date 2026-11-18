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
    "@swc/helpers/_/_class_call_check"
], function(_export, _context) {
    "use strict";
    var C, D, _class_call_check, p1, p2;
    function foo() {
        var p2 = _context.import("./0");
    }
    _export({
        D: void 0,
        p2: void 0
    });
    return {
        setters: [
            function(_class_call_check_ns) {
                _class_call_check = _class_call_check_ns._;
            }
        ],
        execute: function() {
            _context.import("./0");
            p1 = _context.import("./0");
            p1.then(function(zero) {
                return zero.foo();
            });
            _export("p2", p2 = _context.import("./0"));
            /*#__PURE__*/ /*#__PURE__*/ C = /*#__PURE__*/ function() {
                "use strict";
                function C() {
                    _class_call_check(this, C);
                }
                var _proto = C.prototype;
                _proto.method = function method() {
                    var loadAsync = _context.import("./0");
                };
                return C;
            }();
            /*#__PURE__*/ /*#__PURE__*/ _export("D", /*#__PURE__*/ D = /*#__PURE__*/ function() {
                "use strict";
                function D() {
                    _class_call_check(this, D);
                }
                var _proto = D.prototype;
                _proto.method = function method() {
                    var loadAsync = _context.import("./0");
                };
                return D;
            }());
        }
    };
});
