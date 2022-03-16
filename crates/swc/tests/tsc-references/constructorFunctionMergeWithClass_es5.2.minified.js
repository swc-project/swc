import * as swcHelpers from "@swc/helpers";
var SomeClass = function() {
    this.otherProp = 0;
};
new SomeClass();
var SomeClass = function() {
    "use strict";
    swcHelpers.classCallCheck(this, SomeClass);
};
SomeClass.prop = 0;
