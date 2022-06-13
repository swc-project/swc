import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var List = function List() {
    "use strict";
    _class_call_check(this, List);
};
var DerivedList = /*#__PURE__*/ function(List) {
    "use strict";
    _inherits(DerivedList, List);
    var _super = _create_super(DerivedList);
    function DerivedList() {
        _class_call_check(this, DerivedList);
        return _super.apply(this, arguments);
    }
    return DerivedList;
}(List);
var MyList = function MyList() {
    "use strict";
    _class_call_check(this, MyList);
};
var list;
var list2;
var myList;
var xs = [
    list,
    myList
]; // {}[]
var ys = [
    list,
    list2
]; // {}[]
var zs = [
    list,
    null
]; // List<number>[]
var myDerivedList;
var as = [
    list,
    myDerivedList
]; // List<number>[]
