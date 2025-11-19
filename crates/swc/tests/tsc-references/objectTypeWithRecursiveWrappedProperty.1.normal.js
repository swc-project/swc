//// [objectTypeWithRecursiveWrappedProperty.ts]
// Basic recursive type
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var List = function List() {
    "use strict";
    _class_call_check(this, List);
};
var list1 = new List();
var list2 = new List();
var list3 = new List();
list1 = list2; // ok
list1 = list3; // error
