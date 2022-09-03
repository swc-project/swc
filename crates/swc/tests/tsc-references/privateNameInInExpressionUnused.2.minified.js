//// [privateNameInInExpressionUnused.ts]
var _brand_check_brand = new WeakSet();
class Foo {
    #unused;
    #brand = void _brand_check_brand.add(this);
    isFoo(v) {
        return _brand_check_brand.has(v);
    }
}
