import * as swcHelpers from "@swc/helpers";
var _brand_check_brand = new WeakSet();
var _unused = /*#__PURE__*/ new WeakMap(), _brand = /*#__PURE__*/ new WeakMap();
// @strict: true
// @noUnusedLocals: true
// @target: esnext, es2022
class Foo {
    isFoo(v) {
        // This should count as using/reading '#brand'
        return _brand_check_brand.has(v);
    }
    constructor(){
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
}
