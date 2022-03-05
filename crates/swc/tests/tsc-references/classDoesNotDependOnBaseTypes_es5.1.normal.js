import * as swcHelpers from "@swc/helpers";
var StringTreeCollectionBase = function StringTreeCollectionBase() {
    "use strict";
    swcHelpers.classCallCheck(this, StringTreeCollectionBase);
};
var StringTreeCollection = /*#__PURE__*/ function(StringTreeCollectionBase) {
    "use strict";
    swcHelpers.inherits(StringTreeCollection, StringTreeCollectionBase);
    var _super = swcHelpers.createSuper(StringTreeCollection);
    function StringTreeCollection() {
        swcHelpers.classCallCheck(this, StringTreeCollection);
        return _super.apply(this, arguments);
    }
    return StringTreeCollection;
}(StringTreeCollectionBase);
var x;
if (typeof x !== "string") {
    x[0] = "";
    x[0] = new StringTreeCollection;
}
