import * as swcHelpers from "@swc/helpers";
var List = function() {
    "use strict";
    swcHelpers.classCallCheck(this, List);
}, DerivedList = function(List1) {
    "use strict";
    swcHelpers.inherits(DerivedList, List1);
    var _super = swcHelpers.createSuper(DerivedList);
    function DerivedList() {
        return swcHelpers.classCallCheck(this, DerivedList), _super.apply(this, arguments);
    }
    return DerivedList;
}(List), MyList = function() {
    "use strict";
    swcHelpers.classCallCheck(this, MyList);
};
