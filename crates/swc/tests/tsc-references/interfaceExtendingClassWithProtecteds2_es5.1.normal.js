import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
var Bar = function Bar() {
    "use strict";
    _class_call_check(this, Bar);
};
var Baz = function Baz() {
    "use strict";
    _class_call_check(this, Baz);
};
var i;
var r = i.z;
var r2 = i.x; // error
var r3 = i.y; // error
