import * as swcHelpers from "@swc/helpers";
var _foo = /*#__PURE__*/ new WeakMap();
// @target: es2015
var Parent = /*#__PURE__*/ function() {
    "use strict";
    function Parent() {
        swcHelpers.classCallCheck(this, Parent);
        swcHelpers.classPrivateFieldInit(this, _foo, {
            writable: true,
            value: 3
        });
    }
    var _proto = Parent.prototype;
    _proto.accessChildProps = function accessChildProps() {
        var _ref;
        swcHelpers.classPrivateFieldGet(_ref = new Child(), _foo); // OK (`#foo` was added when `Parent`'s constructor was called on `child`)
        swcHelpers.classStaticPrivateFieldSpecGet(Child, Parent, _bar); // Error: not found
    };
    return Parent;
}();
var _bar = {
    writable: true,
    value: 5
};
var _foo1 = /*#__PURE__*/ new WeakMap(), _bar1 = /*#__PURE__*/ new WeakMap();
var Child = /*#__PURE__*/ function(Parent) {
    "use strict";
    swcHelpers.inherits(Child, Parent);
    var _super = swcHelpers.createSuper(Child);
    function Child() {
        swcHelpers.classCallCheck(this, Child);
        var _this;
        _this = _super.apply(this, arguments);
        swcHelpers.classPrivateFieldInit(swcHelpers.assertThisInitialized(_this), _foo1, {
            writable: true,
            value: "foo"
        }) // OK (Child's #foo does not conflict, as `Parent`'s `#foo` is not accessible)
        ;
        swcHelpers.classPrivateFieldInit(swcHelpers.assertThisInitialized(_this), _bar1, {
            writable: true,
            value: "bar"
        }) // OK
        ;
        return _this;
    }
    return Child;
}(Parent);
