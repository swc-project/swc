import * as swcHelpers from "@swc/helpers";
var C = // @target: es5
/*#__PURE__*/ function() {
    "use strict";
    function C(t, z, x) {
        var y = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "hello";
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function foo(x) {
                var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
            }
        },
        {
            key: "foo1",
            value: function foo1(x) {
                var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                for(var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
                    rest[_key - 2] = arguments[_key];
                }
            }
        },
        {
            key: "bar",
            value: function bar() {
                var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
            }
        },
        {
            key: "boo",
            value: function boo() {
                var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
                for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
                    rest[_key - 1] = arguments[_key];
                }
            }
        }
    ]);
    return C;
}();
var D = function D() {
    "use strict";
    var y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "hello";
    swcHelpers.classCallCheck(this, D);
};
var E = function E() {
    "use strict";
    var y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "hello";
    for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        rest[_key - 1] = arguments[_key];
    }
    swcHelpers.classCallCheck(this, E);
};
