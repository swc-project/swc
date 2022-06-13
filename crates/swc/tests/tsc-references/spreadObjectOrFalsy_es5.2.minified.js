import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
var Foo = function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    var _proto = Foo.prototype;
    return _proto.bar = function() {
        this.hasData() && this.data.toLocaleLowerCase();
    }, _proto.hasData = function() {
        return !0;
    }, Foo;
}();
