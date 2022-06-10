import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
function foo(x, y) {
    for(var _len = arguments.length, z = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)z[_key - 2] = arguments[_key];
}
foo(1, 2, "abc"), foo.apply(void 0, [
    1,
    2
].concat(_to_consumable_array(a))), foo.apply(void 0, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
])), obj.foo(1, 2, "abc"), (_obj = obj).foo.apply(_obj, [
    1,
    2
].concat(_to_consumable_array(a))), (_obj1 = obj).foo.apply(_obj1, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
])), obj.foo(1, 2, "abc"), obj.foo.apply(this, [
    1,
    2
].concat(_to_consumable_array(a))), obj.foo.apply(this, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
])), xa[1].foo(1, 2, "abc"), (_instance = xa[1]).foo.apply(_instance, [
    1,
    2
].concat(_to_consumable_array(a))), (_instance1 = xa[1]).foo.apply(_instance1, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
])), xa[1].foo.apply(this, [
    1,
    2,
    "abc"
]);
var _obj, _obj1, _instance, _instance1, a, obj, xa, C = function() {
    "use strict";
    function C(x, y) {
        for(var _len = arguments.length, z = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)z[_key - 2] = arguments[_key];
        _class_call_check(this, C), this.foo(x, y), this.foo.apply(this, [
            x,
            y
        ].concat(_to_consumable_array(z)));
    }
    return C.prototype.foo = function(x, y) {
        for(var _len = arguments.length, z = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)z[_key - 2] = arguments[_key];
    }, C;
}(), D = function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.call(this, 1, 2);
    }
    return D.prototype.foo = function() {
        var _instance2;
        _get(_get_prototype_of(D.prototype), "foo", this).call(this, 1, 2), (_instance2 = _get(_get_prototype_of(D.prototype), "foo", this)).call.apply(_instance2, [
            this,
            1,
            2
        ].concat(_to_consumable_array(a)));
    }, D;
}(C);
