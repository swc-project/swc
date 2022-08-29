//// [thisPropertyAssignmentCircular.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
        this.foo = "Hello";
    }
    var _proto = Foo.prototype;
    _proto.slicey = function slicey() {
        this.foo = this.foo.slice();
    };
    _proto.m = function m() {
        this.foo;
    };
    return Foo;
}();
/** @class */ function C() {
    this.x = 0;
    this.x = function() {
        this.x.toString();
    };
}
