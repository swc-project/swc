// @skipDefaultLibCheck: false
// object types can define string indexers that are more specific than the default 'any' that would be returned
// no errors expected below 
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var o = {};
var r = o[""]; // should be Object
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var c;
var r2 = c[""];
var i;
var r3 = i[""];
var o2;
var r4 = o2[""];
