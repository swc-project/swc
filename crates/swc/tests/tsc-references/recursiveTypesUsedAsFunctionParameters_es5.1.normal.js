import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var List = function List() {
    "use strict";
    _class_call_check(this, List);
};
var MyList = function MyList() {
    "use strict";
    _class_call_check(this, MyList);
};
function foo(x) {}
function foo2(x) {}
function other() {
    var foo3 = function foo3(x) {};
    var foo4 = function foo4(x) {};
    var foo5 = function foo5(x) {
        return null;
    };
    var list;
    var myList;
    var r = foo5(list);
    var r2 = foo5(myList);
}
