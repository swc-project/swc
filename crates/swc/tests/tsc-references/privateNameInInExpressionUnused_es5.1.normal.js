import * as swcHelpers from "@swc/helpers";
var _brand_check_brand = new WeakSet();
var _unused = new WeakMap(), _brand = new WeakMap();
var Foo = // @strict: true
// @noUnusedLocals: true
// @target: esnext, es2022
/*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
        swcHelpers.classPrivateFieldInit(this, _unused, {
            writable: true,
            value: void 0 // expect unused error
        });
        swcHelpers.classPrivateFieldInit(this, _brand, {
            writable: true,
            value: void _brand_check_brand.add(this)
        }) // expect no error
        ;
    }
    var _proto = Foo.prototype;
    _proto.isFoo = function isFoo(v) {
        // This should count as using/reading '#brand'
        return _brand_check_brand.has(v);
    };
    return Foo;
}();
