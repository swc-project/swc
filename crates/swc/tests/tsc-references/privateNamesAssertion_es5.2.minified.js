import * as swcHelpers from "@swc/helpers";
var _p1 = new WeakMap(), Foo = function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo), swcHelpers.classPrivateFieldInit(this, _p1, {
            writable: !0,
            value: function(v) {
                if ("string" != typeof v) throw new Error();
            }
        });
    }
    return Foo.prototype.m1 = function(v) {
        swcHelpers.classPrivateFieldGet(this, _p1).call(this, v);
    }, Foo;
}(), _p11 = new WeakSet(), Foo2 = function() {
    "use strict";
    function Foo2() {
        swcHelpers.classCallCheck(this, Foo2), swcHelpers.classPrivateMethodInit(this, _p11);
    }
    return Foo2.prototype.m1 = function(v) {
        swcHelpers.classPrivateMethodGet(this, _p11, p1).call(this, v);
    }, Foo2;
}();
function p1(v) {
    if ("string" != typeof v) throw new Error();
}
