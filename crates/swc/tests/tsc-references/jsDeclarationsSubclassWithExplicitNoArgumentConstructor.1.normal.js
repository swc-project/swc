//// [index.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
export var Super = function Super(firstArg, secondArg) {
    "use strict";
    _class_call_check(this, Super);
};
export var Sub = /*#__PURE__*/ function(Super) {
    "use strict";
    _inherits(Sub, Super);
    var _super = _create_super(Sub);
    function Sub() {
        _class_call_check(this, Sub);
        return _super.call(this, 'first', 'second');
    }
    return Sub;
}(Super);
