//// [callWithSpread.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
var _obj, _obj1, _obj2, _obj3, _foo_apply, _obj4, _foo_apply1, _obj5, _obj6, _obj7, _obj8, _foo_apply2, _obj9, _foo_apply3, _xa_, _xa_1, _xa_2;
function foo(x, y) {
    for(var _len = arguments.length, z = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        z[_key - 2] = arguments[_key];
    }
}
var a;
var z;
var obj;
var xa;
foo(1, 2, "abc");
foo.apply(void 0, [
    1,
    2
].concat(_to_consumable_array(a)));
foo.apply(void 0, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
]));
obj.foo(1, 2, "abc");
(_obj = obj).foo.apply(_obj, [
    1,
    2
].concat(_to_consumable_array(a)));
(_obj1 = obj).foo.apply(_obj1, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
]));
(_obj2 = obj).foo.apply(_obj2, [
    1,
    2
].concat(_to_consumable_array(a))).foo(1, 2, "abc");
(_foo_apply = (_obj3 = obj).foo.apply(_obj3, [
    1,
    2
].concat(_to_consumable_array(a)))).foo.apply(_foo_apply, [
    1,
    2
].concat(_to_consumable_array(a)));
(_foo_apply1 = (_obj4 = obj).foo.apply(_obj4, [
    1,
    2
].concat(_to_consumable_array(a)))).foo.apply(_foo_apply1, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
]));
obj.foo(1, 2, "abc");
(_obj5 = obj).foo.apply(_obj5, [
    1,
    2
].concat(_to_consumable_array(a)));
(_obj6 = obj).foo.apply(_obj6, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
]));
(_obj7 = obj).foo.apply(_obj7, [
    1,
    2
].concat(_to_consumable_array(a))).foo(1, 2, "abc");
(_foo_apply2 = (_obj8 = obj).foo.apply(_obj8, [
    1,
    2
].concat(_to_consumable_array(a)))).foo.apply(_foo_apply2, [
    1,
    2
].concat(_to_consumable_array(a)));
(_foo_apply3 = (_obj9 = obj).foo.apply(_obj9, [
    1,
    2
].concat(_to_consumable_array(a)))).foo.apply(_foo_apply3, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
]));
xa[1].foo(1, 2, "abc");
(_xa_ = xa[1]).foo.apply(_xa_, [
    1,
    2
].concat(_to_consumable_array(a)));
(_xa_1 = xa[1]).foo.apply(_xa_1, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
]));
(_xa_2 = xa[1]).foo.apply(_xa_2, [
    1,
    2,
    "abc"
]);
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(x, y) {
        for(var _len = arguments.length, z = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
            z[_key - 2] = arguments[_key];
        }
        _class_call_check(this, C);
        this.foo(x, y);
        this.foo.apply(this, [
            x,
            y
        ].concat(_to_consumable_array(z)));
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x, y) {
        for(var _len = arguments.length, z = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
            z[_key - 2] = arguments[_key];
        }
    };
    return C;
}();
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    function D() {
        _class_call_check(this, D);
        var _this;
        _this = _call_super(this, D, [
            1,
            2
        ]);
        return _this = _call_super(this, D, [
            1,
            2
        ].concat(_to_consumable_array(a)));
    }
    var _proto = D.prototype;
    _proto.foo = function foo() {
        var _$_get;
        _get(_get_prototype_of(D.prototype), "foo", this).call(this, 1, 2);
        (_$_get = _get(_get_prototype_of(D.prototype), "foo", this)).call.apply(_$_get, [
            this,
            1,
            2
        ].concat(_to_consumable_array(a)));
    };
    return D;
}(C);
