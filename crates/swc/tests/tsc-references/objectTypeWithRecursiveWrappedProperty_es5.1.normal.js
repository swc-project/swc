import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// Basic recursive type
var List = function List() {
    "use strict";
    _class_call_check(this, List);
};
var list1 = new List();
var list2 = new List();
var list3 = new List();
list1 = list2; // ok
list1 = list3; // error
