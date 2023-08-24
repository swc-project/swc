//// [typeArgumentInferenceWithClassExpression2.ts]
var _class;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
// Should not infer string because it is a static property
(function() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
})(((_class = function _class() {
    _class_call_check(this, _class);
}).prop = "hello", _class)).length;
