import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var SomeClass = function() {
    this.otherProp = 0;
};
new SomeClass();
var SomeClass = function() {
    "use strict";
    _class_call_check(this, SomeClass);
};
SomeClass.prop = 0;
