import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// Types with infinitely expanding recursive types are type checked nominally
var List = function List() {
    "use strict";
    _class_call_check(this, List);
};
var MyList = function MyList() {
    "use strict";
    _class_call_check(this, MyList);
};
var list1 = new List();
var list2 = new List();
var myList1 = new MyList();
var myList2 = new MyList();
list1 = myList1; // error, not nominally equal
list1 = myList2; // error, type mismatch
list2 = myList1; // error, not nominally equal
list2 = myList2; // error, type mismatch
var rList1 = new List();
var rMyList1 = new List();
rList1 = rMyList1; // error, not nominally equal
function foo(t, u) {
    t = u; // error
    u = t; // error
    var a;
    var b;
    a = t; // ok
    a = u; // error
    b = t; // error
    b = u; // ok
}
function foo2(t, u) {
    t = u; // error
    u = t; // was error, ok after constraint made illegal, doesn't matter
    var a;
    var b;
    a = t; // error
    a = u; // error
    b = t; // ok
    b = u; // ok
}
