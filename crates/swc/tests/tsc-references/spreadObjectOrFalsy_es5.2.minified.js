import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _object_spread from "@swc/helpers/lib/_object_spread.js";
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
