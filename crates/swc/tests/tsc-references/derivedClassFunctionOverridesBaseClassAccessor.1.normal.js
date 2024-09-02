//// [derivedClassFunctionOverridesBaseClassAccessor.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    _create_class(Base, [
        {
            key: "x",
            get: function get() {
                return 1;
            },
            set: function set(v) {}
        }
    ]);
    return Base;
}();
// error
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    function Derived() {
        _class_call_check(this, Derived);
        return _call_super(this, Derived, arguments);
    }
    var _proto = Derived.prototype;
    _proto.x = function x() {
        return 1;
    };
    return Derived;
}(Base);
