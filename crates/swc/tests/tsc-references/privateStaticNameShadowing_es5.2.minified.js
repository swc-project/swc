import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_static_private_method_get from "@swc/helpers/lib/_class_static_private_method_get.js";
var X = function() {
    "use strict";
    _class_call_check(this, X), _class_static_private_method_get(X, X, m).call(X);
};
function m() {
    return _class_static_private_method_get({}, X, m).call(X), 1;
}
_class_static_private_method_get(X, X, m).call(X);
