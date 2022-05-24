import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Base = function() {
    "use strict";
    _class_call_check(this, Base);
}, Derived = function(Base1) {
    "use strict";
    _inherits(Derived, Base1);
    var _super = _create_super(Derived);
    function Derived() {
        return _class_call_check(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base);
function f(x) {}
f({
    foo: new Base(),
    bar: new Derived()
}), f({
    foo: new Derived(),
    bar: new Derived()
}), function(x, y) {
    y(null);
}(new Base(), function(x) {
    return x;
}), function(x, y) {
    y(null);
}(new Derived(), function(x) {
    return x;
}), (null)(null), function(x, y) {
    y(null);
}(null, function(x) {
    return x;
});
