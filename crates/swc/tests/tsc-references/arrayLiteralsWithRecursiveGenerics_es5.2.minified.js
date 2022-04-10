import * as swcHelpers from "@swc/helpers";
var List = function() {
    swcHelpers.classCallCheck(this, List);
}, DerivedList = function(List1) {
    swcHelpers.inherits(DerivedList, List1);
    var _super = swcHelpers.createSuper(DerivedList);
    function DerivedList() {
        return swcHelpers.classCallCheck(this, DerivedList), _super.apply(this, arguments);
    }
    return DerivedList;
}(List), MyList = function() {
    swcHelpers.classCallCheck(this, MyList);
};
