//// [objectTypeHidingMembersOfExtendedObject.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var c, i, b, B = function(A) {
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    return B;
}(function A() {
    _class_call_check(this, A);
});
c.valueOf(), c.data.hm, c.hm, i.valueOf(), i.data.hm, i.hm;
var a = {
    valueOf: function() {},
    data: new B()
};
a.valueOf(), a.data.hm, i.hm, b.valueOf();
