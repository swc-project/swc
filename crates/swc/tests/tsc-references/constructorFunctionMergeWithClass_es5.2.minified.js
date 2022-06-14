import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var SomeClass = function() {
    this.otherProp = 0;
};
new SomeClass();
var SomeClass = function() {
    "use strict";
    _class_call_check(this, SomeClass);
};
SomeClass.prop = 0;
