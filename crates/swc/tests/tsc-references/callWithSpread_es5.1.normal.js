import * as swcHelpers from "@swc/helpers";
var _obj, _obj1, _obj2, _obj3, _instance, _obj4, _instance1, _instance2, _instance3;
function foo(x, y) {
    for(var _len = arguments.length, z1 = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        z1[_key - 2] = arguments[_key];
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
].concat(swcHelpers.toConsumableArray(a)));
foo.apply(void 0, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "abc"
]));
obj.foo(1, 2, "abc");
(_obj = obj).foo.apply(_obj, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)));
(_obj1 = obj).foo.apply(_obj1, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "abc"
]));
(_obj2 = obj).foo.apply(_obj2, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a))).foo(1, 2, "abc");
(_instance = (_obj3 = obj).foo.apply(_obj3, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)))).foo.apply(_instance, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)));
(_instance1 = (_obj4 = obj).foo.apply(_obj4, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)))).foo.apply(_instance1, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "abc"
]));
obj.foo(1, 2, "abc");
obj.foo.apply(this, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)));
obj.foo.apply(this, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "abc"
]));
obj.foo.apply(this, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a))).foo(1, 2, "abc");
obj.foo.apply(this, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a))).foo.apply(this, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)));
obj.foo.apply(this, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a))).foo.apply(this, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "abc"
]));
xa[1].foo(1, 2, "abc");
(_instance2 = xa[1]).foo.apply(_instance2, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)));
(_instance3 = xa[1]).foo.apply(_instance3, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "abc"
]));
xa[1].foo.apply(this, [
    1,
    2,
    "abc"
]);
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(x, y) {
        for(var _len = arguments.length, z2 = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
            z2[_key - 2] = arguments[_key];
        }
        swcHelpers.classCallCheck(this, C);
        this.foo(x, y);
        this.foo.apply(this, [
            x,
            y
        ].concat(swcHelpers.toConsumableArray(z2)));
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x, y) {
        for(var _len = arguments.length, z3 = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
            z3[_key - 2] = arguments[_key];
        }
    };
    return C;
}();
var D = /*#__PURE__*/ function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        return _super.call(this, 1, 2);
        return _super.call.apply(_super, [
            this,
            1,
            2
        ].concat(swcHelpers.toConsumableArray(a)));
    }
    var _proto = D.prototype;
    _proto.foo = function foo() {
        var _instance4;
        swcHelpers.get(swcHelpers.getPrototypeOf(D.prototype), "foo", this).call(this, 1, 2);
        (_instance4 = swcHelpers.get(swcHelpers.getPrototypeOf(D.prototype), "foo", this)).call.apply(_instance4, [
            this,
            1,
            2
        ].concat(swcHelpers.toConsumableArray(a)));
    };
    return D;
}(C);
