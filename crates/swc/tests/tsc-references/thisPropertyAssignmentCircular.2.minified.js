//// [thisPropertyAssignmentCircular.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Foo = /*#__PURE__*/ function() {
    function Foo() {
        _class_call_check(this, Foo), this.foo = "Hello";
    }
    var _proto = Foo.prototype;
    return _proto.slicey = function() {
        this.foo = this.foo.slice();
    }, _proto.m = function() {
        this.foo;
    }, Foo;
}();
