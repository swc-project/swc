//// [controlFlowGenericTypes.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export function bounceAndTakeIfA(value) {
    return "A" === value && takeA(value), value;
}
!function() {
    "use strict";
    function EventEmitter() {
        _class_call_check(this, EventEmitter);
    }
    return EventEmitter.prototype.off = function() {
        for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    }, EventEmitter;
}();
