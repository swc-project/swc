import * as swcHelpers from "@swc/helpers";
var _bar, C = (_bar = new WeakSet(), function() {
    "use strict";
    function _class() {
        swcHelpers.classCallCheck(this, _class), swcHelpers.classPrivateMethodInit(this, _bar);
    }
    return _class.prototype.foo = function() {
        swcHelpers.classPrivateFieldSet(this, _bar, console.log("should log this then throw"));
    }, _class;
}());
console.log(new C().foo());
