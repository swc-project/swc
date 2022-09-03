//// [classConstructorAccessibility3.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Foo = function Foo(x) {
    "use strict";
    _class_call_check(this, Foo), this.x = x;
}, Bar = function Bar(x) {
    "use strict";
    _class_call_check(this, Bar), this.x = x;
}, Baz = function Baz(x) {
    "use strict";
    _class_call_check(this, Baz), this.x = x;
}, Qux = function Qux(x) {
    "use strict";
    _class_call_check(this, Qux), this.x = x;
}, a = Foo;
a = Bar, a = Baz, a = Qux;
var b = Baz;
b = Foo, b = Bar, b = Qux;
var c = Qux;
c = Foo, c = Bar, c = Baz;
