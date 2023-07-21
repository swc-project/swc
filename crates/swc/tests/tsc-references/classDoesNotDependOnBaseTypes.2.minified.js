//// [classDoesNotDependOnBaseTypes.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var x, StringTreeCollection = function(StringTreeCollectionBase) {
    _inherits(StringTreeCollection, StringTreeCollectionBase);
    var _super = _create_super(StringTreeCollection);
    function StringTreeCollection() {
        return _class_call_check(this, StringTreeCollection), _super.apply(this, arguments);
    }
    return StringTreeCollection;
}(function StringTreeCollectionBase() {
    _class_call_check(this, StringTreeCollectionBase);
});
"string" != typeof x && (x[0] = "", x[0] = new StringTreeCollection);
