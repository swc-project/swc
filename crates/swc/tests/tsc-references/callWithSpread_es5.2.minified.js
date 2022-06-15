import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
function foo(x, y) {
    for(var _len = arguments.length, z = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)z[_key - 2] = arguments[_key];
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
])), (_obj2 = obj).foo.apply(_obj2, [
    1,
    2
].concat(_to_consumable_array(a))).foo(1, 2, "abc"), (_instance = (_obj3 = obj).foo.apply(_obj3, [
    1,
    2
].concat(_to_consumable_array(a)))).foo.apply(_instance, [
    1,
    2
].concat(_to_consumable_array(a))), (_instance1 = (_obj4 = obj).foo.apply(_obj4, [
    1,
    2
].concat(_to_consumable_array(a)))).foo.apply(_instance1, [
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
])), obj.foo.apply(this, [
    1,
    2
].concat(_to_consumable_array(a))).foo(1, 2, "abc"), obj.foo.apply(this, [
    1,
    2
].concat(_to_consumable_array(a))).foo.apply(this, [
    1,
    2
].concat(_to_consumable_array(a))), obj.foo.apply(this, [
    1,
    2
].concat(_to_consumable_array(a))).foo.apply(this, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
])), xa[1].foo(1, 2, "abc"), (_instance2 = xa[1]).foo.apply(_instance2, [
    1,
    2
].concat(_to_consumable_array(a))), (_instance3 = xa[1]).foo.apply(_instance3, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
])), xa[1].foo.apply(this, [
    1,
    2,
    "abc"
]);
var _obj, _obj1, _obj2, _obj3, _instance, _obj4, _instance1, _instance2, _instance3, a, obj, xa, C = function() {
    "use strict";
    function C(x, y) {
        for(var _len = arguments.length, z = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)z[_key - 2] = arguments[_key];
        _class_call_check(this, C), this.foo(x, y), this.foo.apply(this, [
            x,
            y
        ].concat(_to_consumable_array(z)));
    }
    return C.prototype.foo = function(x, y) {
        for(var _len = arguments.length, z = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)z[_key - 2] = arguments[_key];
    }, C;
}(), D = function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.call(this, 1, 2);
    }
    return D.prototype.foo = function() {
        var _instance;
        _get(_get_prototype_of(D.prototype), "foo", this).call(this, 1, 2), (_instance = _get(_get_prototype_of(D.prototype), "foo", this)).call.apply(_instance, [
            this,
            1,
            2
        ].concat(_to_consumable_array(a)));
    }, D;
}(C);
