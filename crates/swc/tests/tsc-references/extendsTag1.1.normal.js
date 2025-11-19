//// [bug25101.js]
/**
 * @template T
 * @extends {Set<T>} Should prefer this Set<T>, not the Set in the heritage clause
 */ import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _wrap_native_super } from "@swc/helpers/_/_wrap_native_super";
var My = /*#__PURE__*/ function(Set1) {
    "use strict";
    _inherits(My, Set1);
    function My() {
        _class_call_check(this, My);
        return _call_super(this, My, arguments);
    }
    return My;
}(_wrap_native_super(Set));
