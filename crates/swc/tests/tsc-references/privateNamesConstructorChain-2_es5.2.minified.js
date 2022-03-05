import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap(), Parent = function() {
    "use strict";
    function Parent() {
        swcHelpers.classCallCheck(this, Parent), swcHelpers.classPrivateFieldInit(this, _foo, {
            writable: !0,
            value: 3
        });
    }
    return swcHelpers.createClass(Parent, [
        {
            key: "accessChildProps",
            value: function() {
                swcHelpers.classPrivateFieldGet(new Child(), _foo), swcHelpers.classStaticPrivateFieldSpecGet(Child, Parent, _bar);
            }
        }
    ]), Parent;
}(), _bar = {
    writable: !0,
    value: 5
}, _foo1 = new WeakMap(), _bar1 = new WeakMap(), Child = function(Parent) {
    "use strict";
    swcHelpers.inherits(Child, Parent);
    var _super = swcHelpers.createSuper(Child);
    function Child() {
        var _this;
        return swcHelpers.classCallCheck(this, Child), _this = _super.apply(this, arguments), swcHelpers.classPrivateFieldInit(swcHelpers.assertThisInitialized(_this), _foo1, {
            writable: !0,
            value: "foo"
        }), swcHelpers.classPrivateFieldInit(swcHelpers.assertThisInitialized(_this), _bar1, {
            writable: !0,
            value: "bar"
        }), _this;
    }
    return Child;
}(Parent);
new Parent().accessChildProps();
