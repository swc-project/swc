//// [assignParameterPropertyToPropertyDeclarationESNext.ts]
class F {
    Inner = class extends F {
        p2 = this.p1;
    };
    p1 = 0;
}
