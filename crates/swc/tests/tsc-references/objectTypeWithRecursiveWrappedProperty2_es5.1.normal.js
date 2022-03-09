import * as swcHelpers from "@swc/helpers";
// Basic recursive type
var List = function List() {
    "use strict";
    swcHelpers.classCallCheck(this, List);
};
var list1 = new List();
var list2 = new List();
var list3 = new List();
list1 = list2; // ok
list1 = list3; // error
