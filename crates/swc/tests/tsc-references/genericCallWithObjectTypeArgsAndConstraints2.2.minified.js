//// [genericCallWithObjectTypeArgsAndConstraints2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
}, Derived = function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        return _class_call_check(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base);
function f3(x, y) {
    return y(null);
}
new Base(), new Derived(), new Derived(), new Derived(), f3(new Base(), function(x) {
    return x;
}), f3(new Derived(), function(x) {
    return x;
}), f3(null, null), f3(null, function(x) {
    return x;
});
