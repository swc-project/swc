//// [index.js]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
export var Super = function Super(firstArg, secondArg) {
    _class_call_check(this, Super);
};
export var Sub = /*#__PURE__*/ function(Super) {
    function Sub() {
        return _class_call_check(this, Sub), _call_super(this, Sub, [
            'first',
            'second'
        ]);
    }
    return _inherits(Sub, Super), Sub;
}(Super);
