//// [Foo.js]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
Base.foo = "";
export var Foo = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Foo, Base);
    function Foo() {
        _class_call_check(this, Foo);
        return _call_super(this, Foo, arguments);
    }
    return Foo;
}(Base);
Foo.foo = "foo";
//// [Bar.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { Foo } from "./Foo.js";
var Bar = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar, Foo);
    function Bar() {
        _class_call_check(this, Bar);
        return _call_super(this, Bar, arguments);
    }
    return Bar;
}(Foo);
Bar.foo = "foo";
