import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(x) {
        var _this = this;
        swcHelpers.classCallCheck(this, C);
        this.x = x;
        this.ia = 1;
        this.ib = function() {
            return _this.ia;
        };
    }
    var _proto = C.prototype;
    _proto.baz = function baz(x) {
        return "";
    };
    C.foo = function foo(x) {};
    C.bar = function bar(x) {};
    swcHelpers.createClass(C, [
        {
            key: "ic",
            get: function get() {
                return 1;
            },
            set: function set(x) {}
        },
        {
            key: "id",
            get: function get() {
                return 1;
            }
        }
    ], [
        {
            key: "sc",
            get: function get() {
                return 1;
            },
            set: function set(x) {}
        },
        {
            key: "sd",
            get: function get() {
                return 1;
            }
        }
    ]);
    return C;
}();
C.sa = 1;
C.sb = function() {
    return 1;
};
var c;
// BUG 820454
var r1;
var r2;
var D = /*#__PURE__*/ function() {
    "use strict";
    function D(y) {
        swcHelpers.classCallCheck(this, D);
        this.y = y;
    }
    var _proto = D.prototype;
    _proto.foo = function foo() {};
    return D;
}();
var d;
var r3;
var r4;
