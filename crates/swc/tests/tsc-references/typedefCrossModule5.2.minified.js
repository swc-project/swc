//// [mod1.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Bar = function Bar() {
    "use strict";
    _class_call_check(this, Bar);
};
//// [mod2.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
}, Bar = 3;
