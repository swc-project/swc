import * as swcHelpers from "@swc/helpers";
// @target: esnext, es2022, es2015
var getX;
var _x = /*#__PURE__*/ new WeakMap();
var C = function C(x) {
    "use strict";
    swcHelpers.classCallCheck(this, C);
    swcHelpers.classPrivateFieldInit(this, _x, {
        writable: true,
        value: 1
    });
    swcHelpers.classPrivateFieldSet(this, _x, x);
};
var __ = {
    writable: true,
    value: function() {
        // getX has privileged access to #x
        getX = function(obj) {
            return swcHelpers.classPrivateFieldGet(obj, _x);
        };
    }()
};
