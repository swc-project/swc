//// [arrayLiteralsWithRecursiveGenerics.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var list, list2, myList, myDerivedList, List = function List() {
    "use strict";
    _class_call_check(this, List);
}, DerivedList = function(List) {
    "use strict";
    _inherits(DerivedList, List);
    var _super = _create_super(DerivedList);
    function DerivedList() {
        return _class_call_check(this, DerivedList), _super.apply(this, arguments);
    }
    return DerivedList;
}(List), MyList = function MyList() {
    "use strict";
    _class_call_check(this, MyList);
}, xs = [
    list,
    myList
], ys = [
    list,
    list2
], zs = [
    list,
    null
], as = [
    list,
    myDerivedList
];
