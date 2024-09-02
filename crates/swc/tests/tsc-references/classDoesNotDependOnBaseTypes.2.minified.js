//// [classDoesNotDependOnBaseTypes.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var x, StringTreeCollection = /*#__PURE__*/ function(StringTreeCollectionBase) {
    function StringTreeCollection() {
        return _class_call_check(this, StringTreeCollection), _call_super(this, StringTreeCollection, arguments);
    }
    return _inherits(StringTreeCollection, StringTreeCollectionBase), StringTreeCollection;
}(function StringTreeCollectionBase() {
    _class_call_check(this, StringTreeCollectionBase);
});
"string" != typeof x && (x[0] = "", x[0] = new StringTreeCollection);
