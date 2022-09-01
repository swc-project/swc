//// [typesWithSpecializedConstructSignatures.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _create_super(Derived1);
    function Derived1() {
        return _class_call_check(this, Derived1), _super.apply(this, arguments);
    }
    return Derived1;
}(function Base() {
    "use strict";
    _class_call_check(this, Base);
});
var i, a, C = function C(x) {
    return _class_call_check(this, C), x;
};
new C("a"), a = i = a, new C("hi"), new i("bye"), new a("hm");
