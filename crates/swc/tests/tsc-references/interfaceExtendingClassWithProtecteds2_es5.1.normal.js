import * as swcHelpers from "@swc/helpers";
var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
};
var Bar = function Bar() {
    "use strict";
    swcHelpers.classCallCheck(this, Bar);
};
var Baz = function Baz() {
    "use strict";
    swcHelpers.classCallCheck(this, Baz);
};
var i;
var r = i.z;
var r2 = i.x; // error
var r3 = i.y; // error
