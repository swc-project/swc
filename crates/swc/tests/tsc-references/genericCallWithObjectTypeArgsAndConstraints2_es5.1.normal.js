import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// Generic call with constraints infering type parameter from object member properties
// No errors expected
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        _class_call_check(this, Derived);
        return _super.apply(this, arguments);
    }
    return Derived;
}(Base);
function f(x) {
    var r;
    return r;
}
var r = f({
    foo: new Base(),
    bar: new Derived()
});
var r2 = f({
    foo: new Derived(),
    bar: new Derived()
});
function f2(x) {
    var r;
    return r;
}
var i;
var r3 = f2(i);
function f3(x, y) {
    return y(null);
}
var r4 = f3(new Base(), function(x) {
    return x;
});
var r5 = f3(new Derived(), function(x) {
    return x;
});
var r6 = f3(null, null); // any
var r7 = f3(null, function(x) {
    return x;
}); // any
