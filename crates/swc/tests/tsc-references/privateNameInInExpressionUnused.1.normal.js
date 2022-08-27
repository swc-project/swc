//// [privateNameInInExpressionUnused.ts]
var _brand_check_brand = new WeakSet();
class Foo {
    #unused;
    #brand = void _brand_check_brand.add(this);
    isFoo(v) {
        // This should count as using/reading '#brand'
        return _brand_check_brand.has(v);
    }
}
