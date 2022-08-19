var C;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
(new (function() {
    "use strict";
    function C1() {
        _class_call_check(this, C1);
    }
    var _proto = C1.prototype;
    return _proto.foo = function() {
        return new C();
    }, C1;
}())).foo();
