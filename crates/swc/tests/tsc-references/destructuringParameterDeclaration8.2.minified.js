//// [destructuringParameterDeclaration8.ts]
// explicit type annotation should cause `method` to have type 'x' | 'y'
// both inside and outside `test`.
function test(param) {
    param.method, param.nested.p;
}
test({}), test({
    method: "x",
    nested: {
        p: "a"
    }
}), test({
    method: "z",
    nested: {
        p: "b"
    }
}), test({
    method: "one",
    nested: {
        p: "a"
    }
});
