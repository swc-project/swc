import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Bar = function Bar() {
    "use strict";
    _class_call_check(this, Bar);
};
var Foo = /*#__PURE__*/ function(Bar) {
    "use strict";
    _inherits(Foo, Bar);
    function Foo() {
        _class_call_check(this, Foo);
        var _this;
        x: {
            break x;
            _this = _call_super(this, Foo);
        }
        return _assert_this_initialized(_this);
    }
    return Foo;
}(Bar);
try {
    new Foo();
} catch (unused) {
    console.log("catched");
}
