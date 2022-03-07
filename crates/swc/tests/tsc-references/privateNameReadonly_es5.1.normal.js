import * as swcHelpers from "@swc/helpers";
var _bar, _class;
// @target: es2015
var C = (_bar = new WeakSet(), _class = /*#__PURE__*/ function() {
    "use strict";
    function _class1() {
        swcHelpers.classCallCheck(this, _class1);
        swcHelpers.classPrivateMethodInit(this, _bar);
    }
    var _proto = _class1.prototype;
    _proto.foo = function foo() {
        swcHelpers.classPrivateFieldSet(this, _bar, console.log("should log this then throw"));
    };
    return _class1;
}(), _class);
console.log(new C().foo());
function bar() {}
