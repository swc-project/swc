import * as swcHelpers from "@swc/helpers";
var _y = new WeakMap();
var Test = // @target: es2015
/*#__PURE__*/ function() {
    "use strict";
    function Test() {
        swcHelpers.classCallCheck(this, Test);
        swcHelpers.classPrivateFieldInit(this, _y, {
            writable: true,
            value: 123
        });
    }
    Test.something = function something(obj) {
        var _s;
        var _x, _x1;
        swcHelpers.classPrivateFieldSet(obj[(new (_x = new WeakMap(), function _class() {
            swcHelpers.classCallCheck(this, _class);
            swcHelpers.classPrivateFieldInit(this, _x, {
                writable: true,
                value: 1
            });
            this.s = "prop";
        })).s], _y, 1);
        swcHelpers.classPrivateFieldSet(_s = obj[(new (_x1 = new WeakMap(), function _class() {
            swcHelpers.classCallCheck(this, _class);
            swcHelpers.classPrivateFieldInit(this, _x1, {
                writable: true,
                value: 1
            });
            this.s = "prop";
        })).s], _y, swcHelpers.classPrivateFieldGet(_s, _y) + 1);
    };
    return Test;
}();
