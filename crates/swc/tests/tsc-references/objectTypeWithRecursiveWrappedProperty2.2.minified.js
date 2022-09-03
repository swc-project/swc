//// [objectTypeWithRecursiveWrappedProperty2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var List = function List() {
    "use strict";
    _class_call_check(this, List);
}, list1 = new List(), list2 = new List(), list3 = new List();
list1 = list2, list1 = list3;
