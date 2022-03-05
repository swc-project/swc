import * as swcHelpers from "@swc/helpers";
var List = function List() {
    "use strict";
    swcHelpers.classCallCheck(this, List);
};
var DerivedList = /*#__PURE__*/ function(List) {
    "use strict";
    swcHelpers.inherits(DerivedList, List);
    var _super = swcHelpers.createSuper(DerivedList);
    function DerivedList() {
        swcHelpers.classCallCheck(this, DerivedList);
        return _super.apply(this, arguments);
    }
    return DerivedList;
}(List);
var MyList = function MyList() {
    "use strict";
    swcHelpers.classCallCheck(this, MyList);
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
