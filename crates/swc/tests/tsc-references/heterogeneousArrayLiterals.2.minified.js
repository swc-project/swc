//// [heterogeneousArrayLiterals.ts]
// type of an array is the best common type of its elements (plus its contextual type if it exists)
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var WithContextualType, Derived = function(Base) {
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        return _class_call_check(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(function Base() {
    _class_call_check(this, Base);
});
Derived || (Derived = {}), WithContextualType || (WithContextualType = {});
 //function foo3<T extends U, U extends Derived>(t: T, u: U) {
 //    var a = [t, t]; // T[]
 //    var b = [t, null]; // T[]
 //    var c = [t, u]; // {}[]
 //    var d = [t, 1]; // {}[]
 //    var e = [() => t, () => u]; // {}[]
 //    var f = [() => t, () => u, () => null]; // { (): any }[]
 //    var g = [t, base]; // Base[]
 //    var h = [t, derived]; // Derived[]
 //    var i = [u, base]; // Base[]
 //    var j = [u, derived]; // Derived[]
 //}
 //function foo4<T extends U, U extends Base>(t: T, u: U) {
 //    var a = [t, t]; // T[]
 //    var b = [t, null]; // T[]
 //    var c = [t, u]; // BUG 821629
 //    var d = [t, 1]; // {}[]
 //    var e = [() => t, () => u]; // {}[]
 //    var f = [() => t, () => u, () => null]; // { (): any }[]
 //    var g = [t, base]; // Base[]
 //    var h = [t, derived]; // Derived[]
 //    var i = [u, base]; // Base[]
 //    var j = [u, derived]; // Derived[]
 //    var k: Base[] = [t, u];
 //}
