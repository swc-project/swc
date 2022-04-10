import * as swcHelpers from "@swc/helpers";
var _brand_check_brand = new WeakSet(), _unused = new WeakMap(), _brand = new WeakMap(), Foo = function() {
    function Foo() {
        swcHelpers.classCallCheck(this, Foo), swcHelpers.classPrivateFieldInit(this, _unused, {
            writable: !0,
            value: void 0
        }), swcHelpers.classPrivateFieldInit(this, _brand, {
            writable: !0,
            value: void _brand_check_brand.add(this)
        });
    }
    return Foo.prototype.isFoo = function(v) {
        return _brand_check_brand.has(v);
    }, Foo;
}();
