//// [objectTypeWithRecursiveWrappedPropertyCheckedNominally.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var List = function List() {
    "use strict";
    _class_call_check(this, List);
}, MyList = function MyList() {
    "use strict";
    _class_call_check(this, MyList);
};
new List(), new List(), new MyList(), new MyList(), new List(), new List();
