import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var StringTreeCollectionBase = function StringTreeCollectionBase() {
    "use strict";
    _class_call_check(this, StringTreeCollectionBase);
};
var StringTreeCollection = /*#__PURE__*/ function(StringTreeCollectionBase) {
    "use strict";
    _inherits(StringTreeCollection, StringTreeCollectionBase);
    var _super = _create_super(StringTreeCollection);
    function StringTreeCollection() {
        _class_call_check(this, StringTreeCollection);
        return _super.apply(this, arguments);
    }
    return StringTreeCollection;
}(StringTreeCollectionBase);
var x;
if (typeof x !== "string") {
    x[0] = "";
    x[0] = new StringTreeCollection;
}
