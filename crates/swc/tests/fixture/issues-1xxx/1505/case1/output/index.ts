import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var MyClass = function MyClass() {
    "use strict";
    _class_call_check(this, MyClass);
};
export var fn = function() {
    var _class = /*#__PURE__*/ function(MyClass) {
        "use strict";
        _inherits(_class, MyClass);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
            return _super.apply(this, arguments);
        }
        return _class;
    }(MyClass);
    _define_property(_class, "x", 5);
    return _class;
};
