//// [classDoesNotDependOnBaseTypes.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var StringTreeCollectionBase = function StringTreeCollectionBase() {
    "use strict";
    _class_call_check(this, StringTreeCollectionBase);
};
var StringTreeCollection = /*#__PURE__*/ function(StringTreeCollectionBase) {
    "use strict";
    _inherits(StringTreeCollection, StringTreeCollectionBase);
    function StringTreeCollection() {
        _class_call_check(this, StringTreeCollection);
        return _call_super(this, StringTreeCollection, arguments);
    }
    return StringTreeCollection;
}(StringTreeCollectionBase);
var x;
if (typeof x !== "string") {
    x[0] = "";
    x[0] = new StringTreeCollection;
}
