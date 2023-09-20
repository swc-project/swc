//// [recursiveTypesUsedAsFunctionParameters.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
    function foo3(x) {}
    function foo4(x) {}
    function foo5(x) {
        return null;
    }
    var list;
    var myList;
    var r = foo5(list);
    var r2 = foo5(myList);
}
