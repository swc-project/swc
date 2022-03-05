import * as swcHelpers from "@swc/helpers";
// @strict: true
function foo() {
    return /*#__PURE__*/ (function() {
        "use strict";
        function _class() {
            swcHelpers.classCallCheck(this, _class);
        }
        swcHelpers.createClass(_class, [
            {
                key: "foo",
                value: function foo(v) {
                    return v;
                }
            }
        ]);
        return _class;
    })();
}
var C = foo();
C.a;
C.a = 1;
C[2];
C[2] = 42;
var c = new C();
c.foo(1);
