function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Foo = function Foo(x) {
    "use strict";
    _classCallCheck(this, Foo);
    this.x = x;
};
var Bar = function Bar(x) {
    "use strict";
    _classCallCheck(this, Bar);
    this.x = x;
};
var Baz = function Baz(x) {
    "use strict";
    _classCallCheck(this, Baz);
    this.x = x;
};
var Qux = function Qux(x) {
    "use strict";
    _classCallCheck(this, Qux);
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
