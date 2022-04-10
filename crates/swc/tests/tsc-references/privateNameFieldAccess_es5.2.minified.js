import * as swcHelpers from "@swc/helpers";
var _myField = new WeakMap(), A = function() {
    swcHelpers.classCallCheck(this, A), swcHelpers.classPrivateFieldInit(this, _myField, {
        writable: !0,
        value: "hello world"
    }), console.log(swcHelpers.classPrivateFieldGet(this, _myField));
};
