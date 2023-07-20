//// [objectTypeWithRecursiveWrappedPropertyCheckedNominally.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var List = function List() {
    _class_call_check(this, List);
}, MyList = function MyList() {
    _class_call_check(this, MyList);
};
new List(), new List(), new MyList(), new MyList(), new List(), new List();
