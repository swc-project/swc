//// [recursiveTypesUsedAsFunctionParameters.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var List = function List() {
    "use strict";
    _class_call_check(this, List);
}, MyList = function MyList() {
    "use strict";
    _class_call_check(this, MyList);
};
function foo(x) {}
function foo2(x) {}
function other() {
    var myList, foo5 = function(x) {
        return null;
    };
    foo5(void 0), foo5(myList);
}
