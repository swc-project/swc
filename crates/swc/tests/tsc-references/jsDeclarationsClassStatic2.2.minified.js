//// [Foo.js]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base() {
    _class_call_check(this, Base);
};
Base.foo = "";
export var Foo = /*#__PURE__*/ function(Base) {
    function Foo() {
        return _class_call_check(this, Foo), _call_super(this, Foo, arguments);
    }
    return _inherits(Foo, Base), Foo;
}(Base);
Foo.foo = "foo";
//// [Bar.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { Foo } from "./Foo.js";
/*#__PURE__*/ (function(Foo) {
    function Bar() {
        return _class_call_check(this, Bar), _call_super(this, Bar, arguments);
    }
    return _inherits(Bar, Foo), Bar;
})(Foo).foo = "foo";
