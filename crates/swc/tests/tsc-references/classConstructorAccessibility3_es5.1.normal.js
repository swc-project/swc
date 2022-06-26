import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @declaration: true
var Foo = function Foo(x) {
    "use strict";
    _class_call_check(this, Foo);
    this.x = x;
};
var Bar = function Bar(x) {
    "use strict";
    _class_call_check(this, Bar);
    this.x = x;
};
var Baz = function Baz(x) {
    "use strict";
    _class_call_check(this, Baz);
    this.x = x;
};
var Qux = function Qux(x) {
    "use strict";
    _class_call_check(this, Qux);
    this.x = x;
};
// b is public
var a = Foo;
a = Bar;
a = Baz; // error Baz is protected
a = Qux; // error Qux is private
// b is protected
var b = Baz;
b = Foo;
b = Bar;
b = Qux; // error Qux is private
// c is private
var c = Qux;
c = Foo;
c = Bar;
c = Baz;
