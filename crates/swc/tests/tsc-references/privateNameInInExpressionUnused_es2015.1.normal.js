var _brand_check_brand = new WeakSet();
// @strict: true
// @noUnusedLocals: true
// @target: esnext, es2022
class Foo {
    isFoo(v) {
        // This should count as using/reading '#brand'
        return _brand_check_brand.has(v);
    }
    constructor(){
        _unused.set(this, {
            writable: true,
            value: void 0 // expect unused error
        });
        _brand.set(this, {
            writable: true,
            value: void _brand_check_brand.add(this)
        });
    }
}
var _unused = new WeakMap();
var _brand = new WeakMap();
