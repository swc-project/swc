function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
};
var Bar = function Bar() {
    "use strict";
    _classCallCheck(this, Bar);
};
var Baz = function Baz() {
    "use strict";
    _classCallCheck(this, Baz);
};
var i;
var r = i.z;
var r2 = i.x; // error
var r3 = i.y; // error
