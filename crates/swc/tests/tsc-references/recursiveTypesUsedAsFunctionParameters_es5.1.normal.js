import * as swcHelpers from "@swc/helpers";
var List = function List() {
    "use strict";
    swcHelpers.classCallCheck(this, List);
};
var MyList = function MyList() {
    "use strict";
    swcHelpers.classCallCheck(this, MyList);
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
