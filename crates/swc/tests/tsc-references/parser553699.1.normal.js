//// [parser553699.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    var _proto = Foo.prototype;
    _proto.banana = function banana(x) {};
    return Foo;
}();
var Bar = function Bar(c) {
    "use strict";
    _class_call_check(this, Bar);
};
