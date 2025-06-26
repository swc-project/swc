//// [symbolDeclarationEmit12.ts]
var M, M1 = M || (M = {});
class C {
    [Symbol.toPrimitive](x) {}
    [Symbol.isConcatSpreadable]() {}
    get [Symbol.toPrimitive]() {}
    set [Symbol.toPrimitive](x) {}
}
M1.C = C;
