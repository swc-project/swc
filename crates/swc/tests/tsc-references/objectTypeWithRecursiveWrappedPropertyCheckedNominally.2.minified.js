//// [objectTypeWithRecursiveWrappedPropertyCheckedNominally.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var List = function List() {
    "use strict";
    _class_call_check(this, List);
}, MyList = function MyList() {
    "use strict";
    _class_call_check(this, MyList);
}, list1 = new List(), list2 = new List(), myList1 = new MyList(), myList2 = new MyList();
list1 = myList1, list1 = myList2, list2 = myList1, list2 = myList2;
var rList1 = new List(), rMyList1 = new List();
function foo(t, u) {}
function foo2(t, u) {}
rList1 = rMyList1;
