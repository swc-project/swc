//// [privateNameInInExpressionUnused.ts]
class Foo {
    #unused;
    #brand;
    isFoo(v) {
        // This should count as using/reading '#brand'
        return #brand in v;
    }
}
