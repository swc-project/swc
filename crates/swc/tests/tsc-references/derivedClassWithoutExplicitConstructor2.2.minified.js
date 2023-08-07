//// [derivedClassWithoutExplicitConstructor2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var Derived = function(Base) {
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        var _this;
        return _class_call_check(this, Derived), _this = _super.apply(this, arguments), _this.x = 1, _this.y = "hello", _this;
    }
    return Derived;
}(function Base(x) {
    _class_call_check(this, Base), this.a = 1, this.a = x;
});
new Derived(), new Derived(1), new Derived(1, 2), new Derived(1, 2, 3);
var D = function(Base2) {
    _inherits(D, Base2);
    var _super = _create_super(D);
    function D() {
        var _this;
        return _class_call_check(this, D), _this = _super.apply(this, arguments), _this.x = 2, _this.y = null, _this;
    }
    return D;
}(function Base2(x) {
    _class_call_check(this, Base2), this.a = x;
});
new D(), new D(new Date()), new D(new Date(), new Date()), new D(new Date(), new Date(), new Date());
